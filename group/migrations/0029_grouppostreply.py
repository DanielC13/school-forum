# Generated by Django 3.1.3 on 2020-12-12 15:09

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('group', '0028_auto_20201212_2304'),
    ]

    operations = [
        migrations.CreateModel(
            name='GroupPostReply',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=500)),
                ('date_reply', models.DateTimeField(default=django.utils.timezone.now)),
                ('grouppost', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='group.grouppost')),
                ('reply_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]