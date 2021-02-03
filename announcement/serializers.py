from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
from group.models import Group
import os


class Author(serializers.ModelSerializer):
    # group_set = serializers.SlugRelatedField(
    #     many=True, slug_field="name", read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username']


class AnnouncementFileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    file = serializers.FileField(allow_null=True)

    class Meta:
        model = AnnouncementFile
        fields = ['id', 'file', 'post']
        read_only_fields = ('post',)


class AnnouncementSerializer(serializers.ModelSerializer):
    author = Author(read_only=True)
    announcefile = AnnouncementFileSerializer(
        many=True, required=False, allow_null=True)

    class Meta:
        model = Announcement
        fields = "__all__"

    def create(self, validated_data):
        print(validated_data)
        files = validated_data.pop('announcefile').getlist('announcefile')
        post = Announcement.objects.create(**validated_data)
        if len(files):
            for file in files:
                fl = AnnouncementFile(file=file, post=post)
                fl.save()
        return post

    def update(self, instance, validated_data):
        files = validated_data.pop('announcefile').getlist('announcefile')
        deletefiles = validated_data.pop('deletefile').split(',')
        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        if len(files):
            for file in files:
                fl = AnnouncementFile(file=file, post=instance)
                fl.save()

        if int(deletefiles[0]):
            for num in deletefiles:
                AnnouncementFile.objects.get(pk=int(num)).delete()
        return instance
