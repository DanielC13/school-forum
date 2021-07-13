from .models import *
from .serializers import *
from .permissions import *
from rest_framework import viewsets, status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.parsers import FileUploadParser
# from rest_framework.decorators
from django.core.serializers.json import DjangoJSONEncoder
from django.core.serializers import serialize
from django.shortcuts import get_list_or_404
from django.core.exceptions import PermissionDenied, ValidationError
import ast
from operator import itemgetter
# Create your views here.


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()
    permission_classes = [IsAuthenticated, IsAdminCanEdit]
    pagination_class = None


class CoursePostViewSet(viewsets.ModelViewSet):
    serializer_class = CoursePostSerializer
    permission_classes = [IsAuthenticated, IsThisCourse]

    def get_queryset(self):
        courseid = self.kwargs.get('courseid')
        queryset = CoursePost.objects.filter(
            course=courseid).order_by("-date_posted")
        return queryset

    def put(self, request, **kwargs):
        serializer = self.serializer_class(data=request.data)
        print(serializer.is_valid())
        if serializer.is_valid():
            serializer.validated_data['author'] = request.user
            serializer.validated_data['course'] = Course.objects.get(
                pk=kwargs.get('courseid'))
            serializer.validated_data['coursefile'] = request.FILES
            serializer.save()
            return Response(serializer.data)
        print(serializer.errors)

    def update(self, request, pk, **kwargs):
        serializer = self.serializer_class(
            CoursePost.objects.get(pk=pk), data=request.data)
        if serializer.is_valid():
            serializer.validated_data['coursefile'] = request.FILES
            serializer.validated_data['deletefile'] = request.data['deletefile']
            serializer.save()
            return Response(serializer.data)


class BatchViewSet(viewsets.ModelViewSet):
    serializer_class = BatchSerializer
    permission_classes = [IsAdminCanEdit]
    pagination_class = None

    def get_queryset(self):
        courseid = self.kwargs.get('courseid')
        try:
            queryset = Batch.objects.filter(course_type=courseid)
        except:
            raise ValidationError("course id must be an integer")
        print(queryset)
        # if not queryset:
        #     print('is empty!')
        #     raise ValidationError("No batch was found")
        return queryset


class BatchPostViewSet(viewsets.ModelViewSet):
    serializer_class = BatchPostSerializer
    permission_classes = [IsAuthenticated, IsThisBatch]

    def get_queryset(self):
        courseid, batchid = itemgetter('courseid', 'batchid')(self.kwargs)
        queryset = BatchPost.objects.filter(
            batch=batchid, batch__course_type_id=courseid).order_by('-date_posted')
        return queryset

    def put(self, request, **kwargs):
        serializer = self.serializer_class(data=request.data)
        print(request.data)
        print(serializer.is_valid())
        if serializer.is_valid():
            serializer.validated_data['author'] = request.user
            serializer.validated_data['batch'] = Batch.objects.get(
                pk=kwargs.get('batchid'))
            serializer.validated_data['batchfile'] = request.FILES
            serializer.save()
            return Response(serializer.data)
        print(serializer.errors)


class BatchPostReplyViewSet(viewsets.ModelViewSet):
    serializer_class = BatchPostReplySerializer
    permission_classes = [IsThisBatchPost]

    def get_queryset(self):
        courseid, batchid, postid = itemgetter(
            'courseid', 'batchid', 'postid')(self.kwargs)
        queryset = BatchPostReply.objects.filter(
            post=postid, post__batch=batchid, post__batch__course_type_id=courseid)
        return queryset


class CoursePostFileViewSet(viewsets.ModelViewSet):
    serializer_class = CoursePostFileSerializer
    permission_classes = [CourseAuthorOrReadOnly]

    def get_queryset(self):
        courseid, postid = itemgetter('courseid', 'postid')(self.kwargs)
        queryset = CoursePostFile.objects.filter(
            post__course=courseid, post=postid)
        return queryset

    def create(self, request, **kwargs):
        courseid, postid = itemgetter('courseid', 'postid')(kwargs)
        files = dict(request.FILES)['file']
        for i in files:
            postfl = CoursePostFile(
                post=CoursePost.objects.get(pk=postid), file=i)
            postfl.save()
            print(postfl)
        queryset = CoursePostFile.objects.filter(
            post__course=courseid, post=postid)
        serializer = CoursePostFileSerializer(queryset, many=True)
        return Response(serializer.data)


class BatchPostFileViewSet(viewsets.ModelViewSet):
    serializer_class = BatchPostFileSerializer
    permission_classes = [BatchAuthorOrReadOnly]

    def get_queryset(self):
        courseid, batchid, postid = itemgetter(
            'courseid', 'batchid', 'postid')(self.kwargs)
        detail = self.request.user.detail
        if int(courseid) == detail.course.id and int(batchid) == detail.batch.id:
            queryset = BatchPostFile.objects.filter(
                post__batch=batchid, post=postid)
            return queryset
        raise PermissionDenied()

    def create(self, request, **kwargs):
        courseid, batchid, postid = itemgetter(
            'courseid', 'batchid', 'postid')(kwargs)
        files = dict(request.FILES)['file']
        for i in files:
            postfl = BatchPostFile(
                post=BatchPost.objects.get(pk=postid), file=i)
            postfl.save()
            print(postfl)
        queryset = BatchPostFile.objects.filter(
            post__batch=batchid, post=postid)
        serializer = BatchPostFileSerializer(queryset, many=True)
        return Response(serializer.data)


class RegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [IsAdminUser]
    pagination_class = None
