from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import views
from rest_framework.response import Response
import json
#from rest_framework.authentication import BasicAuthentication
from . import measure

class MeasureMonitor(views.APIView):
#	permission_classes = [IsAuthenticated & ~IsAdminUser]

	def get(self, request):
		pacscloud_ipaddr = request.META.get('HTTP_X_PACSCLOUD_IPADDR')
		metric_query = request.query_params
		if metric_query:
			try:
				response = measure.getdata_metric(metric_query['metric'], pacscloud_ipaddr,metric_query["server_selected"], 
													metric_query["start_time"], metric_query["end_time"], metric_query["steptime"])
				if response == 404:
					result = {
					    "error": {
					        "code": 404,
					        "message": "metric could not be found.",
					        "title": "Not Found"
					    }
					}
					return Response(result,status=404) 
				else:
					return Response(response,status=200) 
			except:
				result = {
						    "error": {
						        "code": 400,
						        "message": "Invalid input for operation",
						        "title": "Bad Request"
						    }
						}
				return Response(result,status=400) 
		else:
			result = {
					    "error": {
					        "code": 400,
					        "message": "Invalid input for operation",
					        "title": "Bad Request"
					    }
					}
			return Response(result, status=400)	
