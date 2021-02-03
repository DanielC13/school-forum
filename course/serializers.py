from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User


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
    # coursepostfile_set = CoursePostFileSerializer(
    #     many=True, required=False, allow_null=True)

    class Meta:
        model = CoursePost
        fields = '__all__'

    def create(self, validated_data):
        print(validated_data)
        # files = validated_data.pop('coursefile').getlist('coursefile')
        # post = CoursePost.objects.create(**validated_data)
        # if len(files):
        #     for file in files:
        #         fl = CoursePostFile(file=file, post=post)
        #         fl.save()
        # return post


class BatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = '__all__'


class BatchPostSerializer(serializers.ModelSerializer):
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


class RegisterSerializer(serializers.ModelSerializer):
    course = serializers.ChoiceField(source='detail.course.id', choices=list(
        map(lambda co: (co, co), Course.objects.all())))
    batch = serializers.ChoiceField(source='detail.batch.id', choices=list(
        map(lambda ba: (ba, ba), Batch.objects.all())))

    class Meta:
        model = User
        fields = ['id', 'username', 'email',
                  'password', 'is_staff', 'course', 'batch']

    def create(self, validated_data):
        print(validated_data)
        detail = validated_data.pop('detail')
        user = User.objects.create_user(validated_data.pop(
            'username'), validated_data.pop('email'), validated_data.pop('password'))
        user.is_staff = validated_data.pop('is_staff')
        user.save()
        student = Student(user=user, course=detail.pop(
            'course').pop('id'), batch=detail.pop('batch').pop('id'))
        student.save()
        return user

    def update(self, instance, validated_data):
        print(instance.detail)
        print(validated_data)
        detail = validated_data.pop('detail', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        for attr, value in detail.items():
            setattr(instance.detail, attr, value.pop('id'))
        instance.save()
        return instance
