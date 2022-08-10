from django.urls import include, re_path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'status', views.ViewDICOMImageStatus)
router.register(r'setting/pacscloud', views.ViewSetPACSCloudInfor)
router.register(r'setting/pacsclient', views.ViewSetPACSClientInfor)

#router.register(r'groups', views.GroupViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    re_path('', include(router.urls)),
    re_path(r'^action/find/', views.ViewDICOMImageFind.as_view(), name="find_image"),
    re_path(r'^action/download/$', views.ViewDICOMImageDownload.as_view(), name="download_image"),
    re_path(r'^action/send/$', views.ViewDICOMImageSend.as_view(), name="send_image"),
    re_path(r'^setting/checkstatus/', views.ViewCheckPacsNodeStatus.as_view(), name="check_status"),
]