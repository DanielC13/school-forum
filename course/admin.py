from django.contrib import admin
from .models import *
# Register your models here.
site = admin.site.register
site(Course)
site(CoursePost)
site(CoursePostFile)
site(Batch)
site(BatchPost)
site(BatchPostFile)
site(BatchPostReply)
site(UserInfo)
