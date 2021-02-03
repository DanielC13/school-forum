from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'', ViewGroupViewSet, basename='viewgroup')
router.register(r'edit', EditGroupViewSet, basename='editgroup')
router.register(r'(?P<groupid>\d+)/posts', ViewPostViewSet, basename='viewposts')
router.register(r'(?P<groupid>\d+)/request', ViewRequestViewSet, basename='viewrequest')
router.register(r'(?P<groupid>\d+)/posts/(?P<postid>\d+)/file', ViewPostFileViewSet, basename='viewpostfile')
router.register(r'(?P<groupid>\d+)/posts/(?P<postid>\d+)/replies', ViewPostReplyViewSet, basename='viewpostreplies')
# router.register(r'myposts', MyPostsViewSet, basename='myposts')
urlpatterns = router.urls