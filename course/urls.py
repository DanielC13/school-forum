from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'', CourseViewSet, basename='course')
router.register(r'(?P<courseid>\d+)/posts',
                CoursePostViewSet, basename='courseposts')
router.register(r'(?P<courseid>\d+)/posts/(?P<postid>\d+)/files',
                CoursePostFileViewSet, basename='coursepostfiles')
router.register(r'(?P<courseid>\d+)/batch',
                BatchViewSet, basename='batch')
router.register(r'(?P<courseid>\d+)/batch/(?P<batchid>\d+)/posts',
                BatchPostViewSet, basename='batchposts')
router.register(r'(?P<courseid>\d+)/batch/(?P<batchid>\d+)/posts/(?P<postid>\d+)/replies',
                BatchPostReplyViewSet, basename='batchpostreplies')
router.register(r'(?P<courseid>\d+)/batch/(?P<batchid>\d+)/posts/(?P<postid>\d+)/files',
                BatchPostFileViewSet, basename='batchpostfiles')
urlpatterns = router.urls
