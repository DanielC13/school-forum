from django.shortcuts import render
from .serializers import *
from .models import *
from rest_framework import viewsets, permissions
from rest_framework.permissions import SAFE_METHODS, IsAuthenticated
from rest_framework.parsers import FileUploadParser, FormParser, MultiPartParser
from operator import itemgetter
from django.utils.datastructures import MultiValueDict
from rest_framework.response import Response
# from anythumbnailer import create_thumbnail
# from preview_generator.manager import PreviewManager


class IsAdminUserOrReadOnly(permissions.IsAdminUser):
    def has_permission(self, request, view):
        is_admin = super().has_permission(request, view)
        # get,head,options in SAFE_METHODS
        return request.method in SAFE_METHODS or is_admin

class AnnouncementViewSet(viewsets.ModelViewSet):
    serializer_class = AnnouncementSerializer
    queryset = Announcement.objects.all().order_by('-date_posted')
    permission_classes = [IsAdminUserOrReadOnly, IsAuthenticated]
    http_method_names = ['get', 'put', 'options', 'delete']

    def put(self, request):
        serializer = self.serializer_class(data=request.data)
        print(serializer.is_valid())
        if serializer.is_valid():
            serializer.validated_data['author'] = request.user
            serializer.validated_data['announcefile'] = request.FILES
            serializer.save()
            return Response(serializer.data)
        print(serializer.errors)

    def update(self, request, pk):
        print(pk)
        serializer = self.serializer_class(
            Announcement.objects.get(pk=pk), data=request.data)
        if serializer.is_valid():
            print(request.data)
            serializer.validated_data['announcefile'] = request.FILES
            serializer.validated_data['deletefile'] = request.data['deletefile']
            serializer.save()
            return Response(serializer.data)


# for single file upload
class AnnouncementFileViewSet(viewsets.ModelViewSet):
    serializer_class = AnnouncementFileSerializer
    permission_classes = [IsAdminUserOrReadOnly, IsAuthenticated]
    http_method_names = ['post', 'get', 'delete']

    def get_queryset(self):
        postid = itemgetter('postid')(self.kwargs)
        queryset = AnnouncementFile.objects.filter(post=postid)
        return queryset

    def create(self, request, **kwargs):
        postid = itemgetter('postid')(kwargs)
        print(request.FILES)
        if request.FILES:
            files = dict(request.FILES)['file']
            for i in files:
                print(i)
                postfl = AnnouncementFile(
                    post=Announcement.objects.get(pk=postid), file=i)
                postfl.save()
                # print(postfl.file)
                # postfl.thumbnail = create_thumbnail(
                #     postfl.file, output_format='jpg')
                # postfl.save()
            queryset = AnnouncementFile.objects.filter(post=postid)
            serializer = AnnouncementFileSerializer(queryset, many=True)
            return Response(serializer.data)


# ['application/postscript',
# 'application/pdf',
# 'application/msword',
# re.compile('^application/vnd\\.ms\\-'),
# re.compile('^application/vnd\\.openxmlformats\\-officedocument\\.'),
# 'application/vnd.ms-excel.sheet.macroEnabled.12', 'image/x-portable-pixmap',
# re.compile('^image/'),
# re.compile('^video/'), 'audio/ogg']
