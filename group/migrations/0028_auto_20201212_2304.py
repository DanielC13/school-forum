# Generated by Django 3.1.3 on 2020-12-12 15:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('group', '0027_grouppostfile'),
    ]

    operations = [
        migrations.RenameField(
            model_name='grouppostfile',
            old_name='img',
            new_name='file',
        ),
    ]
