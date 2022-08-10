from directory_tree.views import GetDirectory
from monitor.views import MeasureMonitor
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny

# Create your views here.

class ViewDirectory(GetDirectory):
	permission_classes = [IsAuthenticated]

class ViewMeasureMonitor(MeasureMonitor):
	"""docstring for ClassName"""
	permission_classes = [IsAuthenticated]
		
