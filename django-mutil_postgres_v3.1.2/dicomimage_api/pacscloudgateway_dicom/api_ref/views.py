#from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from image_action.views import DICOMImageFind, DICOMImageDownload,DICOMImageSend, CheckPacsNodeStatus
from image_status.views import DICOMImageStatus
from gateway_setting.views import SetPACSCloudInfor, SetPACSClientInfor
from django_filters.rest_framework import DjangoFilterBackend




class ViewDICOMImageFind(DICOMImageFind):
#	authentication_class = [ BasicAuthentication]
	permission_classes = [IsAuthenticated, ~IsAdminUser,]



class ViewDICOMImageStatus(DICOMImageStatus):
	"""docstring for ClassName"""
	permission_classes = [IsAuthenticated]



class ViewDICOMImageDownload(DICOMImageDownload):
	"""docstring for ClassName"""
#	authentication_class = [ BasicAuthentication]
	permission_classes = [IsAuthenticated, ~IsAdminUser,]

class ViewDICOMImageSend(DICOMImageSend):
	"""docstring for ClassName"""
#	authentication_class = [ BasicAuthentication]
	permission_classes = [IsAuthenticated, ~IsAdminUser]

class ViewSetPACSCloudInfor(SetPACSCloudInfor):
	"""docstring for ClassName"""
	filter_backends = [DjangoFilterBackend]
#	authentication_class = [ BasicAuthentication]

class ViewSetPACSClientInfor(SetPACSClientInfor):
	"""docstring for ClassName"""
	filter_backends = [DjangoFilterBackend]
#	authentication_class = [ BasicAuthentication]

class ViewCheckPacsNodeStatus(CheckPacsNodeStatus):
	"""docstring for ClassName"""
	permission_classes = [AllowAny]
#	authentication_class = [ BasicAuthentication]