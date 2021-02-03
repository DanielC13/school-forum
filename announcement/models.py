from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
# Create your models here.


class Announcement(models.Model):
    title = models.CharField(max_length=400)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    date_posted = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f" {self.title} by {self.author.username}"


class AnnouncementFile(models.Model):
    post = models.ForeignKey(Announcement, on_delete=models.CASCADE,
                             default=None, blank=True, related_name="announcefile")
    file = models.FileField(upload_to='announcement_file/', null=True)

    def __str__(self):
        return f"{self.file}"
