from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
# Create your models here.


class Group(models.Model):
    name = models.CharField(max_length=300)
    date_created = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    members = models.ManyToManyField(
        User, related_name='is_members', blank=True)

    def __str__(self):
        return f" {self.id} | {self.name}"


class GroupRequest(models.Model):
    description = models.TextField(max_length=300)
    request_by = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    status = models.CharField(max_length=30, choices=[("awaiting", "Awaiting"), (
        "accepted", "Accepted"), ("declined", "Declined")], default='awaiting')

    def __str__(self):
        return f"{self.request_by.username} request to join {self.group.name}"


class GroupPost(models.Model):
    title = models.CharField(max_length=400)
    content = models.TextField()
    group = models.ForeignKey(Group, on_delete=models.CASCADE, default=None)
    author = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    date_posted = models.DateTimeField(default=timezone.now)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.id} |{self.group.name} | {self.title} by {self.author.username}"


class GroupPostComment(models.Model):
    content = models.CharField(max_length=500)
    post = models.ForeignKey(
        GroupPost, related_name="comments", on_delete=models.CASCADE, default=None)
    comment_by = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, default=None)
    date_comment = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.post.group.name} | {self.post.title} | {self.content} | {self.comment_by.username}"


class GroupPostFile(models.Model):
    post = models.ForeignKey(GroupPost, on_delete=models.CASCADE,
                             default=None, blank=True, related_name='groupfile')
    file = models.FileField(upload_to='grouppost_file/', null=True)

    def __str__(self):
        return f"{self.post.title}"
