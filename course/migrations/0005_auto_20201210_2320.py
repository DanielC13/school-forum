# Generated by Django 3.1.3 on 2020-12-10 15:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('course', '0004_auto_20201210_1629'),
    ]

    operations = [
        migrations.RenameField(
            model_name='batchpost',
            old_name='dated_posted',
            new_name='date_posted',
        ),
        migrations.RenameField(
            model_name='coursepost',
            old_name='dated_posted',
            new_name='date_posted',
        ),
        migrations.CreateModel(
            name='BatchPostReply',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('detail', models.CharField(max_length=500)),
                ('date_reply', models.DateTimeField(default=django.utils.timezone.now)),
                ('batchpost', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='course.batchpost')),
                ('reply_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]