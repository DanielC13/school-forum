from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'', CourseViewSet, basename='course')
router.register(r'(?P<courseid>\d+)/posts',
                CoursePostViewSet, basename='courseposts')
router.register(r'(?P<courseid>\d+)/posts/(?P<postid>\d+)/files',
                CoursePostFileViewSet, basename='coursepostfiles')
router.register(r'view/(?P<courseid>\d+)/batch',
                BatchViewSet, basename='batch')
router.register(r'view/(?P<courseid>\d+)/batch/(?P<batchid>\d+)/posts',
                BatchPostViewSet, basename='batchposts')
router.register(r'view/(?P<courseid>\d+)/batch/(?P<batchid>\d+)/posts/(?P<postid>\d+)/replies',
                BatchPostReplyViewSet, basename='batchpostreplies')
router.register(r'view/(?P<courseid>\d+)/batch/(?P<batchid>\d+)/posts/(?P<postid>\d+)/files',
                BatchPostFileViewSet, basename='batchpostfiles')

router.register(r'edit/(?P<courseid>\d+)/posts',
                AdminCoursePostViewSet, basename='admincourseposts')
router.register(r'edit/(?P<courseid>\d+)/batch',
                AdminBatchViewSet, basename='adminbatch')
router.register(r'edit/(?P<courseid>\d+)/batch/(?P<batchid>\d+)/posts',
                AdminBatchPostViewSet, basename='adminbatchposts')
router.register(r'edit/(?P<courseid>\d+)/batch/(?P<batchid>\d+)/posts/(?P<postid>\d+)/replies',
                AdminBatchPostReplyViewSet, basename='adminbatchpostreplies')
urlpatterns = router.urls
