# Generated by Django 3.1.3 on 2020-12-14 01:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('group', '0030_auto_20201213_2228'),
    ]

    operations = [
        migrations.RenameField(
            model_name='grouppostreply',
            old_name='grouppost',
            new_name='post',
        ),
    ]
