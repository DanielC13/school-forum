from .models import *
from .serializers import *
from .permissions import *
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser,IsAuthenticated
# from rest_framework.decorators
from django.core.serializers.json import DjangoJSONEncoder
from django.core.serializers import serialize
from django.http import Http404
from django.core.exceptions import PermissionDenied
from operator import itemgetter
import ast

# class Lzyencoder(DjangoJSONEncoder):
#     def default(self,obj):
#         return ast.literal_eval(super().default(obj).replace("/",''))

# def serialize(srlcls,item):
#     result = srlcls(item,many=True)
#     return Response(result.data)


class ViewGroupViewSet(viewsets.ModelViewSet):
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated,GroupCreatorOrReadOnly]
    def get_queryset(self):
        queryset = Group.objects.all()
        return queryset

class ViewRequestViewSet(viewsets.ModelViewSet):
    serializer_class = GroupRequestSerializer
    permission_classes = [GroupRequestOnly]
    def get_queryset(self):
        groupid = self.kwargs.get('groupid')
        if self.request.user.group_set.filter(pk=groupid):
            queryset = GroupRequest.objects.filter(group=groupid)
            return queryset
        queryset = []
        return queryset

class EditGroupViewSet(viewsets.ModelViewSet):
    serializer_class = GroupSerializer
    permission_classes = [IsAdminUser]
    def get_queryset(self):
        queryset = Group.objects.filter(created_by=self.request.user.id)
        return queryset


class ViewPostViewSet(viewsets.ModelViewSet):
    serializer_class = GroupPostSerializer
    permission_classes = [GroupMemberOnly]
    def get_queryset(self):
        me = self.request.user
        groupid = self.kwargs.get('groupid')
        queryset = GroupPost.objects.filter(group=groupid)
        return queryset


class ViewPostFileViewSet(viewsets.ModelViewSet):
    serializer_class = GroupPostFileSerializer
    permission_classes = [PostAuthorOnly]
    def get_queryset(self):
        postid,groupid = itemgetter('postid','groupid')(self.kwargs)
        queryset = GroupPostFile.objects.filter(post=postid,post__group=groupid)
        return queryset

    def create(self,request,**kwargs):
        postid,groupid = itemgetter('postid','groupid')(kwargs)
        files = dict(request.FILES)['file']
        for i in files:
            postfl = GroupPostFile(post=GroupPost.objects.get(pk=postid),file=i)
            postfl.save()
            print(postfl)
        queryset = GroupPostFile.objects.filter(post=postid)
        serializer = GroupPostFileSerializer(queryset,many=True)
        return Response(serializer.data)


class ViewPostReplyViewSet(viewsets.ModelViewSet):
    serializer_class = GroupPostReplySerializer
    permission_classes = [CommentSection]
    def get_queryset(self):
        groupid, postid = itemgetter('groupid','postid')(self.kwargs)
        queryset = GroupPostReply.objects.filter(post=postid,post__group=groupid)
        return queryset

class MyPostsViewSet(viewsets.ModelViewSet):
    serializer_class = GroupPostSerializer
    def get_queryset(self):
        queryset = GroupPost.objects.filter(author=self.request.user.id)
        return queryset