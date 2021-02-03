from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'', AnnouncementViewSet, basename='viewannouncementfile')
router.register(r'(?P<postid>\d+)/files', AnnouncementFileViewSet, basename='announcementfile')
urlpatterns = router.urls