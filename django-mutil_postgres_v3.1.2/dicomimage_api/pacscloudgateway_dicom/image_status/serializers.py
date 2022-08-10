from rest_framework import serializers
from .models import DICOMImageInfor, DICOMDownloadStatus, DICOMSendStatus
from gateway_setting.serializers import PACSCloudInforSerializer, PACSClientInforSerializer

class DICOMDownloadStatusSerializer(serializers.ModelSerializer):

   class Meta:
      model = DICOMDownloadStatus
      fields = ('id','download_status',
                  'imagedownload_completed','imagedownload_failed',
                  'imagedownload_warning','created_at')

class DICOMSendStatusSerializer(serializers.ModelSerializer):

   class Meta:
      model = DICOMSendStatus
      fields = (  'id','send_status',
                  'imagesend_completed','imagesend_failed',
                  'imagesend_Warning','created_at', 'update_at')

class DICOMImageInforSerializer(serializers.ModelSerializer):
   dicomdownloadstatus = DICOMDownloadStatusSerializer(many=True, read_only=True)
   dicomsendstatus = DICOMSendStatusSerializer(many=True, read_only=True)
   pacscloudinfor = PACSCloudInforSerializer(many=True, read_only=True)
   pacsclientinfor = PACSClientInforSerializer(many=True, read_only=True)

   class Meta:
      model = DICOMImageInfor
      fields = (  'id', 'uuid', 'patid', 'image_count', 
                  'created_at', 'update_at', 'download_status', 
                  'send_status', 'dicomdownloadstatus', 
                  'dicomsendstatus','pacscloudinfor','pacsclientinfor')
