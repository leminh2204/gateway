import os
import threading
import uuid
import glob
from django.utils import timezone
from django.conf import settings
from pydicom import dcmread
from pydicom.dataset import Dataset
from pynetdicom import AE, StoragePresentationContexts, evt, build_role
from pynetdicom.sop_class import PatientRootQueryRetrieveInformationModelFind, PatientRootQueryRetrieveInformationModelGet
from pynetdicom.sop_class import (VerificationSOPClass, CTImageStorage, SecondaryCaptureImageStorage, ComputedRadiographyImageStorage, 
									MRImageStorage, DigitalXRayImagePresentationStorage)
from image_status.models import DICOMImageInfor, DICOMDownloadStatus, DICOMSendStatus
from gateway_setting.models import PACSCloudInfor, PACSClientInfor


def verify_pacscloud_service(ipaddr, port, aetitle):

	#verify pacs cloud service by c-echo
		ae = AE()
		ae.add_requested_context(VerificationSOPClass)
		try:
			assoc = ae.associate(ipaddr, int(port), ae_title=aetitle)
		except:
			return False

	# Release the association
		if assoc.is_established:
			return True
		else:
			return False
	#	assoc.release()


def find_dicom_images(ipaddr,port, aetitle, PatientID, StudyDate):

		#debug_logger()

		ae = AE()
		ae.add_requested_context(PatientRootQueryRetrieveInformationModelFind)
#		print(PatientID)
		# Create our Identifier (query) dataset
		ds = Dataset()
		ds.StudyInstanceUID = '*'
		ds.StudyDate = StudyDate
		ds.PatientName = '*'
		ds.PatientID = PatientID
		ds.ModalitiesInStudy = '*'
		ds.NumberOfStudyRelatedInstances=''
		ds.QueryRetrieveLevel = 'STUDY' 
		list_dicom_images = []
		# Associate with the peer AE at IP 127.0.0.1 and port 11112
		assoc = ae.associate(ipaddr, int(port), ae_title=aetitle)
		if assoc.is_established:
		    # Send the C-FIND request
		    responses = assoc.send_c_find(ds, PatientRootQueryRetrieveInformationModelFind)
		    for (status, identifier) in responses:
		        if status:
		            if '{0:04X}'.format(status.Status) != '0000':
		            	list_dicom_images.append(identifier)
		        else:
		            list_dicom_images = None

		    # Release the association
		    assoc.release()
		else:
			list_dicom_images = None

		return list_dicom_images

class SendFileDicom(object):
	"""docstring for ClassName"""

	def __init__(self, ipaddr_pacsclient, aetitle_pacsclient, dicom_image_id):
		self.ipaddr_pacsclient =  ipaddr_pacsclient
		self.aetitle_pacsclient = aetitle_pacsclient
		self.dicomimage_pk= dicom_image_id
		self.filepath_dicom_data = self.get_dicomimage_infor()

	def get_dicomimage_infor(self):
		DICOMImageInfor.objects.filter(id=self.dicomimage_pk).update(send_status=202)
		dicomimage_infor = DICOMImageInfor.objects.get(id=self.dicomimage_pk)
		dicomimage_send = DICOMSendStatus.objects.create(send_status='sending', imagesend_completed=0, 
												imagesend_failed=0, imagesend_Warning=0, dicom_image=dicomimage_infor)
		return {'path_image':dicomimage_infor.path_image, 'send_id': dicomimage_send.id}
#		dicomimage_infor.save()

	def get_status_send_c_store(self, assoc):
		# Use the C-STORE service to send the dataset
		# returns the response status as a pydicom Dataset
		list_DICOM = glob.glob("%s/*" %(self.filepath_dicom_data['path_image']))
		imagesend_completed = imagesend_failed = imagesend_Warning = 0
		for DICOM in list_DICOM:
			# Read in our DICOM dataset
			ds = dcmread(DICOM)

			# Associate with peer AE at IP 127.0.0.1 and port 11112
			# Use the C-STORE service to send the dataset
			# returns the response status as a pydicom Dataset
			try:
				status = assoc.send_c_store(ds)
			except:
				status = None
			# Check the status of the storage request
			if status:
				if '0x{0:04x}'.format(status.Status) == '0x0000':
				# If the storage request succeeded this will be 0x0000
					imagesend_completed += 1
				else:
					imagesend_Warning += 1
			else:
				imagesend_failed+=1

			if not (imagesend_completed % 50) and imagesend_completed // 50:
				DICOMSendStatus.objects.filter(id=self.filepath_dicom_data['send_id']).update(imagesend_completed=imagesend_completed)

			# Release the association
		assoc.release()
		if not imagesend_failed and not imagesend_Warning:
			dicomimage_infor = DICOMImageInfor.objects.filter(id=self.dicomimage_pk).update(send_status=201)
		else:
			dicomimage_infor = DICOMImageInfor.objects.filter(id=self.dicomimage_pk).update(send_status=406)

		update_dicomimage_send = DICOMSendStatus.objects.filter(id=self.filepath_dicom_data['send_id'])
		update_dicomimage_send.update(	send_status='sent', imagesend_completed=imagesend_completed,
										imagesend_failed=imagesend_failed, imagesend_Warning=imagesend_Warning,  update_at= timezone.now())
		return None

	def sendDICOM_to_BKPACS(self):
			# Initialise the Application Entity
	#		debug_logger()
			ae = AE()
			# Add a requested presentation context
			ae.requested_contexts = StoragePresentationContexts

			assoc = ae.associate(self.ipaddr_pacsclient,6002, ae_title=self.aetitle_pacsclient)
			if assoc.is_established:
				thread_send_c_store = threading.Thread(target=self.get_status_send_c_store, args=(assoc,), name='send_c_store')
				thread_send_c_store.start()
				return {'status': True, 'image_id':self.dicomimage_pk, 
						'send_id':self.filepath_dicom_data['send_id']}

			else:
				return {'status': False}

class DownLoadFileDicom(object):
	"""docstring for ClassName"""
	def __init__(	self, ipaddr_pacscloud, aetitle_pacscloud,  
					patient_id, modality,  study_instanceuid, 
					pacsclient_id, pacscloud_id, image_count, current_user):
		self.study_instanceuid = study_instanceuid
		self.patient_id = patient_id
		self.ipaddr_pacscloud =  ipaddr_pacscloud
		self.aetitle_pacscloud = aetitle_pacscloud
		self.modality = modality
		self.owner_id = current_user.id
		self.quantity_stored=0
		self.pacsclient_id = pacsclient_id
		self.pacscloud_id = pacscloud_id
		self.image_count = image_count
		self.random_uuid = str(uuid.uuid1().hex)
		self.tmp_folder = getattr(settings, "TMP_FOLDER", None)
		self.dicomimage = self.set_dicomimage_infor()

	def set_dicomimage_infor(self):
		dicomimage_infor = DICOMImageInfor.objects.create(	uuid=self.study_instanceuid, path_image='undefined', patid = self.patient_id,
															image_count=self.image_count ,deleted=0, download_status=202, owner=self.owner_id)
		# set pacscloud source load data
		pacscloudinfor = PACSCloudInfor.objects.get(id=self.pacscloud_id)
		dicomimage_infor.pacscloudinfor.add(pacscloudinfor)
		# set pacsclient destination load data
		pacsclientinfor = PACSClientInfor.objects.get(id=self.pacsclient_id)
		dicomimage_infor.pacsclientinfor.add(pacsclientinfor)

		dicomimage_download =DICOMDownloadStatus.objects.create(download_status='init', imagedownload_completed=0, 
																imagedownload_failed=0, imagedownload_warning=0, 
																dicom_image=dicomimage_infor) 

		return {'dicomimage_pk': dicomimage_infor.id, 'dicomimage_download_pk': dicomimage_download.id}
#		dicomimage_infor.save()


	def handle_store(self,event):
		"""create path tmp save file"""
		path_create = os.path.join(self.tmp_folder, self.random_uuid, self.study_instanceuid)
		if not os.path.exists(path_create):
			os.makedirs(path_create)
		path_tmp = "%s/%s/%s/" %(self.tmp_folder, self.random_uuid, self.study_instanceuid)
		"""Handle a C-STORE request event."""
		ds = event.dataset
		ds.file_meta = event.file_meta
		filename = path_tmp + ds.SOPInstanceUID + '.dcm'
		# Save the dataset using the SOP Instance UID as the filename
		ds.save_as(filename, write_like_original=False)
		if not self.quantity_stored:
			DICOMImageInfor.objects.filter(id=self.dicomimage['dicomimage_pk']).update(path_image=os.path.join(self.tmp_folder, 
																												self.random_uuid, 
																												self.study_instanceuid), 
																						update_at= timezone.now())
			DICOMDownloadStatus.objects.filter(id=self.dicomimage['dicomimage_download_pk']).update(download_status='downloading')
		self.quantity_stored+=1
		if not (self.quantity_stored % 50):
			DICOMDownloadStatus.objects.filter(id=self.dicomimage['dicomimage_download_pk']).update(imagedownload_completed=self.quantity_stored)
		# Return a 'Success' status
		return 0x0000

	def get_responses_c_get(self, ds, PatientRootQueryRetrieveInformationModelGet, assoc):
		#get_responses_c_get
		responses = assoc.send_c_get(ds, PatientRootQueryRetrieveInformationModelGet)
		for (status, identifier) in responses:
			if status:
				# update dicom imaage infor 
				DICOMImageInfor.objects.filter(id=self.dicomimage['dicomimage_pk']).update(download_status=201, update_at= timezone.now())
				DICOMDownloadStatus.objects.filter(id=self.dicomimage['dicomimage_download_pk']).update(
																						download_status='0x{0:04x}'.format(status.Status), 
																						imagedownload_completed=status.NumberOfCompletedSuboperations,
																						imagedownload_failed=status.NumberOfFailedSuboperations,
																						imagedownload_warning=status.NumberOfWarningSuboperations,
																						update_at= timezone.now())
			else:
				update_dicomimage_infor = DICOMImageInfor.objects.filter(id=self.dicomimage['dicomimage_pk'])
				update_dicomimage_infor.update(download_status=408, update_at= timezone.now())
		assoc.release()


	def download_file_pacscloud(self):
		#down load dicom to gateway
		handlers = [(evt.EVT_C_STORE, self.handle_store)]
		# Initialise the Application Entity
		ae = AE()
		# Add the requested presentation contexts (QR SCU)
		ae.add_requested_context(PatientRootQueryRetrieveInformationModelGet)
		# Add the requested presentation context (Storage SCP)
		ae.requested_contexts = StoragePresentationContexts[:-1]

		# Create an SCP/SCU Role Selection Negotiation item for Image Storage
		if self.modality == "CR":
			role = build_role(ComputedRadiographyImageStorage, scp_role=True)
		elif self.modality == "CT":
			role = build_role(CTImageStorage, scp_role=True)
		elif self.modality == "MR":
			role = build_role(MRImageStorage, scp_role=True)
		elif self.modality == "DX":
			role = build_role(DigitalXRayImagePresentationStorage, scp_role=True)
		elif self.modality == "['PR', 'CR']":
			role = build_role(ComputedRadiographyImageStorage, scp_role=True)
		# Create our Identifier (query) dataset
		# We need to supply a Unique Key Attribute for each level above the
		#   Query/Retrieve level
		ds = Dataset()
		ds.QueryRetrieveLevel = 'STUDY'
		# Unique key for PATIENT level
		ds.PatientID = self.patient_id
		# Unique key for STUDY level
		ds.StudyInstanceUID = self.study_instanceuid
		# Associate with peer AE at IP 127.0.0.1 and port 11112
		assoc = ae.associate(self.ipaddr_pacscloud, 6002, ae_title=self.aetitle_pacscloud, ext_neg=[role], evt_handlers=handlers)

		if assoc.is_established:
			# Use the C-GET service to send the identifier
			# use muti threading no await respones
			thread_c_get = threading.Thread(target=self.get_responses_c_get, args=(ds,PatientRootQueryRetrieveInformationModelGet, assoc), 
											name='thread_c_get')
			thread_c_get.start()
			return {'status': True, 'pk':self.dicomimage['dicomimage_pk'], 'study_instanceuid':self.study_instanceuid}

		else:
			return {'status': False}