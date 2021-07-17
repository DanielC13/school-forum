from django.db.models import fields
from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'


class GroupRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupRequest
        fields = '__all__'


class GroupPostFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupPostFile
        fields = '__all__'


class GroupPostSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    groupfile = GroupPostFileSerializer(
        many=True, required=False, allow_null=True)

    class Meta:
        model = GroupPost
        fields = '__all__'

    def create(self, validated_data):
        print(validated_data)
        files = validated_data.pop('groupfile').getlist('groupfile')
        post = GroupPost.objects.create(**validated_data)
        if len(files):
            for file in files:
                fl = GroupPostFile(file=file, post=post)
                fl.save()
        return post
    
    def update(self, instance, validated_data):
        print(validated_data)
        if validated_data.get('groupfile'):
            files = validated_data.pop('groupfile').getlist('groupfile')
        else:
            files = []
        if validated_data.get('deletefile'):
            deletefiles = validated_data.pop('deletefile').split(',')
        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
 
        instance.save()
        if len(files):
            for file in files:
                fl = GroupPostFile(file=file, post=instance)
                fl.save()
        try:
            deletefiles
        except NameError:
            print('no deletefiles')
        else:
            if int(deletefiles[0]):
                for num in deletefiles:
                    GroupPostFile.objects.get(pk=int(num)).delete()
        return instance


class GroupPostReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupPostReply
        fields = '__all__'
