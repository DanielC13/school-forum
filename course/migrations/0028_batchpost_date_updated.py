# Generated by Django 3.1.3 on 2021-07-13 10:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0027_auto_20210713_1814'),
    ]

    operations = [
        migrations.AddField(
            model_name='batchpost',
            name='date_updated',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
