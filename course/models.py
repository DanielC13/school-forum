from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

# Create your models here.


class Course(models.Model):
    name = models.CharField(max_length=300, unique=True)

    def __str__(self):
        return self.name


class CoursePost(models.Model):
    title = models.CharField(max_length=400)
    content = models.TextField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE, default=None)
    author = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    date_posted = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=30, choices=[("pending", "Pending"), (
        "permitted", "Permitted"), ("disallowed", "Disallowed")], default="pending")

    def __str__(self):
        return f" {self.course.name} | {self.title} by {self.author.username}"


class CoursePostFile(models.Model):
    post = models.ForeignKey(
        CoursePost, on_delete=models.CASCADE, default=None, blank=True)
    file = models.FileField(upload_to='coursepost_file/', null=True)

    def __str__(self):
        return f"{self.post.title}"


class Batch(models.Model):
    name = models.CharField(max_length=500)
    course_type = models.ForeignKey(Course, on_delete=models.CASCADE)
    level = models.CharField(max_length=30, choices=[(
        '1', '1'), ('2', '2'), ('3', '3'), ('4', '4')], default='1')

    def __str__(self):
        return f"level {self.level} | {self.name} | {self.course_type.name}"


class BatchPost(models.Model):
    title = models.CharField(max_length=400)
    content = models.TextField()
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    date_posted = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=30, choices=[("pending", "Pending"), (
        "permitted", "Permitted"), ("disallowed", "Disallowed")], default="pending")

    def __str__(self):
        return f"{self.batch.name} | {self.title} by {self.author.username}"


class BatchPostFile(models.Model):
    post = models.ForeignKey(
        BatchPost, on_delete=models.CASCADE, default=None, blank=True)
    file = models.FileField(upload_to='batchpost_file/', null=True)

    def __str__(self):
        return f"{self.post.title}"


class BatchPostReply(models.Model):
    content = models.CharField(max_length=500)
    post = models.ForeignKey(BatchPost, on_delete=models.CASCADE)
    reply_by = models.ForeignKey(User, on_delete=models.CASCADE)
    date_reply = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.post.batch.name} | {self.post.title} | {self.content} | {self.reply_by.username}"


class Student(models.Model):
    user = models.OneToOneField(
        User, related_name='detail', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} | {self.course.name} | {self.batch.name}"
