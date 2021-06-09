from rest_framework import permissions
from course.models import *


class IsAdminCanEdit(permissions.BasePermission):
    def has_permission(self, request, view):
        detail = request.user.detail
        if view.action in ['list']:
            return True
        if view.action in ['create']:
            return request.user.is_staff
        return True

    def has_object_permission(self, request, view, obj):
        detail = request.user.detail
        if view.action in ['retrieve']:
            return True
        if view.action in ['update', 'partial_update', 'destroy']:
            return request.user.is_staff
        return False

# for file


class CourseAuthorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        detail = request.user.detail
        coursepost = CoursePost.objects.get(
            pk=int(request.parser_context['kwargs']['postid']))
        if view.action in ['list']:
            return True

        if view.action in ['create']:
            return coursepost.author == request.user and coursepost.status == "pending" or request.user.is_staff
        # print(CoursePost.objects.get(
        #     pk=int(request.parser_context['kwargs']['postid'])).author, request.user)
        return coursepost.author == request.user

    def has_object_permission(self, request, view, obj):
        detail = request.user.detail
        if view.action in ['retrieve']:
            return True
        if view.action in ['update', 'partial_update', 'destroy']:
            return obj.post.author == request.user and obj.post.status == "pending" or request.user.is_staff
        return False


class BatchAuthorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        detail = request.user.detail
        if view.action in ['list']:
            return True
        print(BatchPost.objects.get(
            pk=int(request.parser_context['kwargs']['postid'])).author, request.user)
        return BatchPost.objects.get(pk=int(request.parser_context['kwargs']['postid'])).author == request.user

    def has_object_permission(self, request, view, obj):
        detail = request.user.detail
        if view.action in ['retrieve']:
            return True
        if view.action in ['update', 'partial_update', 'destroy']:
            return obj.post.author == request.user or request.user.is_staff
        return False


# for this course
class IsThisCourse(permissions.BasePermission):
    def has_permission(self, request, view):
        detail = request.user.detail
        if request.method == "POST":
            return False
        if view.action in ['list']:
            return True
        if view.action in ['create']:
            return detail.course.id == int(request.parser_context['kwargs']['courseid'])
        # print(detail.course.id,int(request.parser_context['kwargs']['courseid']))
        return detail.course.id == int(request.parser_context['kwargs']['courseid'])

    def has_object_permission(self, request, view, obj):
        detail = request.user.detail
        if view.action in ['retrieve']:
            return True
        if view.action in ['update', 'partial_update', 'destroy'] and detail.course == obj.course:
            return obj.author == request.user and obj.status == "pending" or request.user.is_staff
        return False


# for this batch
class IsThisBatch(permissions.BasePermission):
    def has_permission(self, request, view):
        detail = request.user.detail
        return detail.batch.id == int(request.parser_context['kwargs']['batchid']) and detail.course.id == int(request.parser_context['kwargs']['courseid']) or request.user.is_staff

    def has_object_permission(self, request, view, obj):
        detail = request.user.detail
        if view.action in ['retrieve', 'update', 'partial_update', 'destroy'] and detail.batch == obj.batch:
            return obj.author == request.user
        return False


# for replies
class IsThisBatchPost(permissions.BasePermission):
    def has_permission(self, request, view):
        detail = request.user.detail
        return int(request.parser_context['kwargs']['courseid']) == detail.course.id and detail.batch.id == int(request.parser_context['kwargs']['batchid']) or request.user.is_staff

    def has_object_permission(self, request, view, obj):
        detail = request.user.detail
        if request.user.is_staff:
            return True
        if view.action in ['retrieve', 'update', 'partial_update', 'destroy'] and detail.batch == obj.post.batch:
            return obj.reply_by == request.user or obj.post.author == request.user
        return False
