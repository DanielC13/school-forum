# Generated by Django 3.1.3 on 2021-01-10 15:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0021_auto_20201213_1439'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='name',
            field=models.CharField(max_length=300, unique=True),
        ),
    ]