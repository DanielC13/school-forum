from rest_framework import serializers
from .models import *

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'


class GroupRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupRequest
        fields = '__all__'


class GroupPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupPost
        fields = '__all__'

class GroupPostFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupPostFile
        fields = '__all__'

class GroupPostReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupPostReply
        fields = '__all__'


