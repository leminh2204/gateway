import shutil
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.response import Response
#from rest_framework.authentication import BasicAuthentication
from .models import DICOMImageInfor
from .serializers import DICOMImageInforSerializer



class DICOMImageStatus(viewsets.ModelViewSet):
	"""docstring for ClassName"""
	queryset = DICOMImageInfor.objects.filter(deleted=0)
	serializer_class = DICOMImageInforSerializer
	http_method_names = ['get','delete']
	filter_backends = [DjangoFilterBackend]
	filterset_fields = ['id','uuid','download_status','send_status']

	def get_queryset(self):
		# after get all products on DB it will be filtered by its owner and return the queryset
		owner_queryset = self.queryset.filter(owner=self.request.user.id)
		return owner_queryset

	def destroy(self, request,  *args, **kwargs):
		dicom_image_infor = get_object_or_404(DICOMImageInfor, id=kwargs['pk'])
		try:
			shutil.rmtree((dicom_image_infor.path_image).rsplit("/", 1)[0])
		except OSError as e:
			pass
		return super(DICOMImageStatus, self).destroy(request, *args, **kwargs)
