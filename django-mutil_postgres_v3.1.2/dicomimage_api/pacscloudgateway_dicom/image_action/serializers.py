from rest_framework import serializers


class DICOMImageSerializer(serializers.Serializer):
   """ Data DICOM image respone """
   study_date = serializers.CharField()
   modalities = serializers.CharField()
   patient_name = serializers.CharField()
   patient_id = serializers.CharField()
   image_count = serializers.CharField()
   study_instanceuid = serializers.CharField()



class DICOMImageDownloadSerializer(serializers.Serializer):
   """ Data DICOM image Identified get PACScloud to PACSlocal """
   modalities = serializers.CharField()		
   patient_id = serializers.CharField()
   study_instanceuid = serializers.CharField()
   image_count = serializers.IntegerField()
   pacsclient_id = serializers.IntegerField() 
   pacscloud_id = serializers.IntegerField()


class DICOMImageSendSerializer(serializers.Serializer):
   """ Data DICOM image Identified get PACScloud to PACSlocal """	
   image_id = serializers.CharField()