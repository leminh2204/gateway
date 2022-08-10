from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import views
from rest_framework.response import Response
import json
#from rest_framework.authentication import BasicAuthentication
from . import directoryimage

class GetDirectory(views.APIView):
#	permission_classes = [IsAuthenticated & ~IsAdminUser]

	def get(self, request):
		pacscloud_ipaddr = request.META.get('HTTP_X_PACSCLOUD_IPADDR')
		path_directory = request.query_params.get('path_directory')
		try:
			result = directoryimage.get_directory_tree(pacscloud_ipaddr,path_directory)
			return Response(result.json(),status=200)
		except:
			result = {
					    "error": {
					        "code": 404,
					        "message": "PACSCloud could not be found.",
					        "title": "Not Found"
					    }
					}
			return Response(result,status=404) 
