from django.shortcuts import get_object_or_404
from rest_framework import viewsets, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
#from rest_framework.authentication import BasicAuthentication
from .models import PACSCloudInfor, PACSClientInfor
from .serializers import PACSCloudInforSerializer, PACSClientInforSerializer
from pynetdicom import AE
from pynetdicom.sop_class import VerificationSOPClass



class SetPACSCloudInfor(viewsets.ModelViewSet):
	"""docstring for ClassName"""
	queryset = PACSCloudInfor.objects.all()
	serializer_class = PACSCloudInforSerializer

	def get_permissions(self):
		"""Instantiates and returns the list of permissions that this view requires."""
		permission_user_actions = ['list']
		for user_action in permission_user_actions:
			if self.action == user_action :
				permission_classes = [IsAuthenticated,]
			else:
				permission_classes = [IsAdminUser,]
		return [permission() for permission in permission_classes]


class SetPACSClientInfor(viewsets.ModelViewSet):
	"""docstring for ClassName"""
	queryset = PACSClientInfor.objects.all()
	serializer_class = PACSClientInforSerializer

	def get_permissions(self):
		"""Instantiates and returns the list of permissions that this view requires."""
		permission_user_actions = ['list']
		for user_action in permission_user_actions:
			if self.action == user_action :
				permission_classes = [IsAuthenticated,]
			else:
				permission_classes = [IsAdminUser,]
		return [permission() for permission in permission_classes]

