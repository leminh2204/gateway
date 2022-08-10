from django.db import models

# Create your models here.

class DICOMImageInfor(models.Model):
	"""docstring for """
	uuid = models.CharField(max_length=200)
	patid = models.CharField(max_length=200,  null=True)
	image_count = models.IntegerField(null=True, blank=True)
	path_image =  models.CharField(max_length=200)
	created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
	update_at = models.DateTimeField(auto_now=True, null=True, blank=True)
	deleted = models.BooleanField()
	download_status = models.IntegerField(null=True, blank=True)
	send_status = models.IntegerField(null=True, blank=True)
	owner = models.IntegerField(null=True, blank=True)

	class Meta:
		ordering = ['-id']

class DICOMDownloadStatus(models.Model):
	dicom_image = models.ForeignKey(DICOMImageInfor, on_delete=models.CASCADE, null=True, related_name='dicomdownloadstatus')
	download_status = models.CharField(max_length=200)
	imagedownload_completed =  models.CharField(max_length=200)
	imagedownload_failed =  models.CharField(max_length=200)
	imagedownload_warning =  models.CharField(max_length=200)
	created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
	update_at = models.DateTimeField(auto_now=True, null=True, blank=True)



class DICOMSendStatus(models.Model):
	dicom_image = models.ForeignKey(DICOMImageInfor, on_delete=models.CASCADE, null=True, related_name='dicomsendstatus')
	send_status = models.CharField(max_length=200)
	imagesend_completed =  models.CharField(max_length=200)
	imagesend_failed =  models.CharField(max_length=200)
	imagesend_Warning =  models.CharField(max_length=200)
	created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
	update_at = models.DateTimeField(auto_now=True, null=True, blank=True)
