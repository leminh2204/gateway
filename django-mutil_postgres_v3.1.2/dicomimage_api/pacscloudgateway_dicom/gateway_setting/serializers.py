from rest_framework import serializers
from .models import PACSCloudInfor, PACSClientInfor

class PACSCloudInforSerializer(serializers.ModelSerializer):

	class Meta:
		model = PACSCloudInfor
		fields = ("id","ip_addr","ae_title","port","hospital_code","hospital_name","decription","region","created_at","update_at")

class PACSClientInforSerializer(serializers.ModelSerializer):

	class Meta:
		model = PACSClientInfor
		fields = ("id","ip_addr","ae_title","port","zone","device","decription","created_at","update_at")
