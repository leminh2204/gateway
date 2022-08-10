from django.shortcuts import get_object_or_404
from rest_framework import views
from rest_framework.response import Response
#from rest_framework.authentication import BasicAuthentication
from .dicom import verify_pacscloud_service, find_dicom_images, DownLoadFileDicom, SendFileDicom
from .serializers import DICOMImageSerializer, DICOMImageDownloadSerializer, DICOMImageSendSerializer
from image_status.models import DICOMImageInfor


class DICOMImageFind(views.APIView):
	def get(self, request):
		pacscloud_ipaddr = request.META.get('HTTP_X_PACSCLOUD_IPADDR')
		pacscloud_aetitle = request.META.get('HTTP_X_PACSCLOUD_AETILTLE')
		pacscloud_service_is_valid = verify_pacscloud_service(pacscloud_ipaddr, 6002, pacscloud_aetitle)

		if pacscloud_service_is_valid:
			patient_id = request.query_params.get('patient_id')
			study_date = request.query_params.get('study_date')
			list_dicom_images = find_dicom_images(pacscloud_ipaddr, 6002, pacscloud_aetitle, patient_id, study_date)
			if patient_id and list_dicom_images:
				result=[]
				for dicom_image in list_dicom_images:
					patient_dicom_infor= {	'study_date': dicom_image.StudyDate, 
											'modalities': dicom_image.ModalitiesInStudy, 
											'patient_name': dicom_image.PatientName, 
											'patient_id': dicom_image.PatientID, 
											'image_count': dicom_image.NumberOfStudyRelatedInstances,
											'study_instanceuid':  dicom_image.StudyInstanceUID
											}
					result.append(patient_dicom_infor)

				return Response({'patient':DICOMImageSerializer(result, many=True).data}, status=200)
			else:
				result = {
						    "error": {
						        "code": 404,
						        "message": "Patient's Id %s could not be found." %patient_id,
						        "title": "Not Found"
						    }
						}
				return Response(data=result, status=404)
		else:
			result = {
					    "error": {
					        "code": 404,
					        "message": "IP or AE could not be found.",
					        "title": "Not Found"
					    }
					}
			return Response(data=result, status=404)

class DICOMImageDownload(views.APIView):
	"""docstring for ClassName"""
	def post(self, request):
		pacscloud_ipaddr = request.META.get('HTTP_X_PACSCLOUD_IPADDR')
		pacscloud_aetitle = request.META.get('HTTP_X_PACSCLOUD_AETILTLE')
		pacscloud_service_is_valid = verify_pacscloud_service(pacscloud_ipaddr, 6002, pacscloud_aetitle)

		if pacscloud_service_is_valid:
			serializer = DICOMImageDownloadSerializer(data=request.data)
			if serializer.is_valid():
				DICOMimage_identified = serializer.data
				download_DICOMimage = DownLoadFileDicom(pacscloud_ipaddr, pacscloud_aetitle, 
														DICOMimage_identified['patient_id'], DICOMimage_identified['modalities'],
														DICOMimage_identified['study_instanceuid'], DICOMimage_identified['pacsclient_id'], DICOMimage_identified['pacscloud_id'],
														DICOMimage_identified['image_count'], request.user)
				status_download = download_DICOMimage.download_file_pacscloud()
				if status_download["status"]:
					result = {
								"dicomimage": {
										"image_id":status_download['pk'],
										"study_instanceuid": status_download['study_instanceuid']
								}
							}
					return Response(result, status=202)
				else:
					return Response({"error": {"code": 406,"message": "An unknown error","title": "Not Acceptable"}}, status=406)

			else:
				result = {
						    "error": {
						        "code": 400,
						        "message": "Invalid input for operation",
						        "title": "Bad Request"
						    }
						}
				return Response(result, status=400)	
		else:
			result = {
					    "error": {
					        "code": 404,
					        "message": "IP or AE could not be found.",
					        "title": "Not Found"
					    }
					}
			return Response(data=result, status=404)

class DICOMImageSend(views.APIView):
	"""docstring for ClassName"""
	def post(self, request):
		pacsclient_ipaddr = request.META.get('HTTP_X_PACSCLIENT_IPADDR')
		pacsclient_aetitle = request.META.get('HTTP_X_PACSCLIENT_AETILTLE')
		pacsclient_service_is_valid = verify_pacscloud_service(pacsclient_ipaddr, 6002, pacsclient_aetitle)

		if pacsclient_service_is_valid:
			serializer = DICOMImageSendSerializer(data=request.data)
			if serializer.is_valid():
				DICOMimage_identified = serializer.data
				dicom_image = get_object_or_404(DICOMImageInfor, id=DICOMimage_identified['image_id'])
				owner_permission = (request.user.id == dicom_image.owner)
				if owner_permission:
					send_DICOMimage =  SendFileDicom(pacsclient_ipaddr, pacsclient_aetitle, DICOMimage_identified['image_id'])
					status_send = send_DICOMimage.sendDICOM_to_BKPACS()
					if status_send["status"]:
						result = {
									"dicomimage": {
											"image_id":status_send['image_id'],
											"send_id":status_send['send_id']
									}
								}
						return Response(result, status=202)
					else:
						return Response({"error": {"code": 406,"message": "An unknown error","title": "Not Acceptable"}}, status=406)
				else:
					return Response( {"detail": "Not found."}, status=404)	

			else:
				result = {
						    "error": {
						        "code": 400,
						        "message": "Invalid input for operation",
						        "title": "Bad Request"
						    }
						}
				return Response(result, status=400)	

		else:
			result = {
					    "error": {
					        "code": 404,
					        "message": "IP or AE could not be found.",
					        "title": "Not Found"
					    }
					}
			return Response(data=result, status=404)

class CheckPacsNodeStatus(views.APIView):
	"""docstring for ClassName"""
	def get(self, request):
		"""docstring for get"""
		ipaddr = request.query_params.get('ipaddr')
		port = request.query_params.get('port')
		aetitle = request.query_params.get('aetitle')
		checkstatus = verify_pacscloud_service(ipaddr, port,aetitle)

		if checkstatus:
			result = {
						"status": True,
						"message": "Pacs service is valid.",
						"title": "OK",
						"code": 200
					}
			return Response(result, status=200)
		else:
			result = {
					    "status": False,
						"message": "Pacs service is invalid.",
						"title": "Not Found",
						"code": 404
					}
			return Response(data=result, status=404)