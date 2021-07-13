from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
from course.models import UserInfo


class Author(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'


class CoursePostFileSerializer(serializers.ModelSerializer):
    # post = CoursePostSerializer()
    id = serializers.IntegerField(required=False)
    file = serializers.FileField(allow_null=True)

    class Meta:
        model = CoursePostFile
        fields = ['id', 'file']


class CoursePostSerializer(serializers.ModelSerializer):
    author = Author(read_only=True)
    coursefile = CoursePostFileSerializer(
        many=True, required=False, allow_null=True)

    class Meta:
        model = CoursePost
        fields = '__all__'

    def create(self, validated_data):
        print(validated_data)
        files = validated_data.pop('coursefile').getlist('coursefile')
        post = CoursePost.objects.create(**validated_data)
        if len(files):
            for file in files:
                fl = CoursePostFile(file=file, post=post)
                fl.save()
        return post


class BatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = '__all__'


class BatchPostSerializer(serializers.ModelSerializer):
    author = Author(read_only=True)
    class Meta:
        model = BatchPost
        fields = '__all__'


class BatchPostFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = BatchPostFile
        fields = '__all__'


class BatchPostReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = BatchPostReply
        fields = '__all__'


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ['course', 'batch']
        depth = 1


class RegisterSerializer(serializers.ModelSerializer):
    course = serializers.ChoiceField(source='detail.course.id', choices=list(
        map(lambda co: (co.id, co), Course.objects.all())))
    batch = serializers.ChoiceField(source='detail.batch.id', choices=list(
        map(lambda ba: (ba.id, ba), Batch.objects.all())))
    identity = serializers.ChoiceField(source='detail.identity', choices=[(
        'student', 'student'), ('teacher', 'Teacher'), ('admin', 'Admin')])
    detail = UserInfoSerializer(read_only=True)

    class Meta:
        model = User
        extra_kwargs = {'password': {'write_only': True}}
        fields = ['id', 'username', 'email',
                  'password', 'is_staff', 'course', 'batch', 'identity', 'detail']

    def create(self, validated_data):
        print(validated_data)
        detail = validated_data.pop('detail')
        user = User.objects.create_user(validated_data.pop(
            'username'), validated_data.pop('email'), validated_data.pop('password'))
        if detail['identity'] == "admin":
            user.is_staff = True
        user.save()
        userInfo = UserInfo(user=user, course=Course.objects.get(id=detail.pop(
            'course').pop('id')), batch=Batch.objects.get(id=detail.pop('batch').pop('id')), identity=detail.pop('identity'))
        userInfo.save()
        return user

    def update(self, instance, validated_data):
        print(validated_data)
        detail = validated_data.pop('detail', None)
        for attr, value in validated_data.items():
            if attr == "username":
                print('Cannot change username')
            elif attr == "password":
                print('Cannot change password')
            else:
                setattr(instance, attr, value)
        if detail:
            for attr, value in detail.items():
                if attr == "identity" and value == "admin":
                    instance.is_staff = True
                else:
                    instance.is_staff = False
                if attr == "course":
                    setattr(instance.detail, attr,
                            Course.objects.get(id=value.pop('id')))
                elif attr == "batch":
                    setattr(instance.detail, attr,
                            Batch.objects.get(id=value.pop('id')))
                else:
                    setattr(instance.detail, attr, value)
                print(attr, value)
        instance.save()
        instance.detail.save()
        return instance
