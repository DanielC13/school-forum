# Generated by Django 3.1.3 on 2020-12-07 21:11

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('group', '0013_auto_20201207_1651'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='User',
            new_name='Member',
        ),
    ]