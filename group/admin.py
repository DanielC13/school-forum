from django.contrib import admin
from .models import *

# Register your models here.
site = admin.site.register
site(Group)
site(GroupRequest)
site(GroupPost)
site(GroupPostFile)
site(GroupPostReply)

