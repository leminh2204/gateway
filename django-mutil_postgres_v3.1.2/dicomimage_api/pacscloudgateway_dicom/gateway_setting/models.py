from django.db import models
from image_status.models import DICOMImageInfor

# Create your models here.

class PACSCloudInfor(models.Model):
	dicom_image = models.ManyToManyField(DICOMImageInfor, related_name='pacscloudinfor')
	ip_addr = models.CharField(max_length=200)
	ae_title = models.CharField(max_length=200)
	port = models.IntegerField(default=6002)
	hospital_code =  models.CharField(max_length=200)
	hospital_name =  models.CharField(max_length=200)
	decription =  models.CharField(max_length=200)
	region =  models.CharField(max_length=200)
	created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
	update_at = models.DateTimeField(auto_now=True, null=True, blank=True)

class PACSClientInfor(models.Model):
	dicom_image = models.ManyToManyField(DICOMImageInfor,  related_name='pacsclientinfor')
	ip_addr = models.CharField(max_length=200)
	ae_title = models.CharField(max_length=200)
	port = models.IntegerField(default=6002)
	zone = models.CharField(max_length=200,null=True, blank=True)
	device = models.CharField(max_length=200,null=True, blank=True)
	decription = models.CharField(max_length=200,null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
	update_at = models.DateTimeField(auto_now=True, null=True, blank=True)

