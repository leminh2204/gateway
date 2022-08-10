from django.urls import include, re_path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
#router.register(r'groups', views.GroupViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    re_path('', include(router.urls)),
    re_path(r'^directory/$', views.ViewDirectory.as_view(), name="list-directory"),
    re_path(r'^system/$', views.ViewMeasureMonitor.as_view(), name="monitor"),
    # re_path(r'^action/send/$', views.DICOMImageSend.as_view(), name="send_image"),   
]