# Generated by Django 3.1.3 on 2020-12-13 14:28

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('group', '0029_grouppostreply'),
    ]

    operations = [
        migrations.CreateModel(
            name='GroupRequest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField(max_length=300)),
                ('status', models.CharField(choices=[('awaiting', 'Awaiting'), ('accepted', 'Accepted'), ('declined', 'Declined')], default='awaiting', max_length=30)),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='group.group')),
                ('request_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.DeleteModel(
            name='Announcement',
        ),
    ]
