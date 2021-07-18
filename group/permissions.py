from rest_framework import permissions
from .models import *
from django.shortcuts import get_object_or_404


class GroupCreatorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action in ['create']:
            groupcount = request.user.group_set.count()
            if groupcount >= 3:
                return False
        return True

    def has_object_permission(self, request, view, obj):
        if view.action in ['retrieve']:
            return True
        if view.action in ['update', 'partial_update', 'destroy']:
            return obj.created_by == request.user


class GroupMemberOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == "POST":
            return False
        if view.action in ['list', 'create']:
            print(get_object_or_404(Group, pk=int(
                request.parser_context['kwargs']['groupid'])))
            return get_object_or_404(Group, pk=int(request.parser_context['kwargs']['groupid'])) in request.user.is_members.all()
        return True

    def has_object_permission(self, request, view, obj):
        if view.action in ['retrieve']:
            return get_object_or_404(Group, pk=int(request.parser_context['kwargs']['groupid'])) in request.user.is_members.all()
        if view.action in ['update', 'partial_update', 'destroy']:
            return obj.author == request.user


class PostAuthorOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action in ['list', 'create']:
            return GroupPost.objects.filter(pk=int(request.parser_context['kwargs']['postid'])).first() in request.user.grouppost_set.all() and Group.objects.filter(pk=int(request.parser_context['kwargs']['groupid'])).first() in request.user.is_members.all()
        return True

    def has_object_permission(self, request, view, obj):
        if view.action in ['retrieve']:
            return get_object_or_404(Group, pk=int(request.parser_context['kwargs']['groupid'])) in request.user.is_members.all()
        if view.action in ['update', 'partial_update', 'destroy']:
            return obj.post.author == request.user


class CommentSection(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action in ['list', 'create']:
            return Group.objects.filter(pk=int(request.parser_context['kwargs']['groupid'])).first() in request.user.is_members.all()
        return True

    def has_object_permission(self, request, view, obj):
        if view.action in ['retrieve']:
            return get_object_or_404(Group, pk=int(request.parser_context['kwargs']['groupid'])) in request.user.is_members.all()
        if view.action in ['update', 'partial_update', 'destroy']:
            return obj.post.author == request.user or obj.comment_by == request.user


class GroupRequestOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action in ['create']:
            return Group.objects.filter(pk=int(request.parser_context['kwargs']['groupid'])).first() not in request.user.is_members.all() and not request.user.grouprequest_set.filter(group=int(request.parser_context['kwargs']['groupid']))
        # if view.action in ['list']:
        #     return request.user == Group.objects.filter(pk=int(request.parser_context['kwargs']['groupid'])).first().created_by
        return True

    def has_object_permission(self, request, view, obj):
        if view.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            return Group.objects.filter(pk=int(request.parser_context['kwargs']['groupid'])).first().created_by == request.user
