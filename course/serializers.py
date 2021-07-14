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

    def update(self, instance, validated_data):
        print(validated_data)
        if validated_data.get('coursefile'):
            files = validated_data.pop('coursefile').getlist('coursefile')
        else:
            files = []
        if validated_data.get('deletefile'):
            deletefiles = validated_data.pop('deletefile').split(',')
        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user

        if user:
            if user.detail.identity == "teacher" or user.detail.identity == "admin":
                instance.status = validated_data.get('status', instance.status)
            elif user.detail.identity == "student":
                instance.status = "pending"
        instance.save()
        if len(files):
            for file in files:
                fl = CoursePostFile(file=file, post=instance)
                fl.save()
        try:
            deletefiles
        except NameError:
            print('no deletefiles')
        else:
            if int(deletefiles[0]):
                for num in deletefiles:
                    CoursePostFile.objects.get(pk=int(num)).delete()
        return instance


class BatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = '__all__'


class BatchPostFileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    file = serializers.FileField(allow_null=True)

    class Meta:
        model = BatchPostFile
        fields = ['id', 'file']


class BatchPostSerializer(serializers.ModelSerializer):
    author = Author(read_only=True)
    batchfile = BatchPostFileSerializer(
        many=True, required=False, allow_null=True)

    class Meta:
        model = BatchPost
        fields = '__all__'

    def create(self, validated_data):
        print(validated_data)
        files = validated_data.pop('batchfile').getlist('batchfile')
        post = BatchPost.objects.create(**validated_data)
        if len(files):
            for file in files:
                fl = BatchPostFile(file=file, post=post)
                fl.save()
        return post

    def update(self, instance, validated_data):
        print(validated_data)
        if validated_data.get('batchfile'):
            files = validated_data.pop('batchfile').getlist('batchfile')
        else:
            files = []
        if validated_data.get('deletefile'):
            deletefiles = validated_data.pop('deletefile').split(',')
        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        if len(files):
            for file in files:
                fl = BatchPostFile(file=file, post=instance)
                fl.save()
        try:
            deletefiles
        except NameError:
            print('no deletefiles')
        else:
            if int(deletefiles[0]):
                for num in deletefiles:
                    BatchPostFile.objects.get(pk=int(num)).delete()
        return instance


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
