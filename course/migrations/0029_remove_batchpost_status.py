# Generated by Django 3.1.3 on 2021-07-13 12:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0028_batchpost_date_updated'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='batchpost',
            name='status',
        ),
    ]