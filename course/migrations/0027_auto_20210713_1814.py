# Generated by Django 3.1.3 on 2021-07-13 10:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0026_auto_20210713_1700'),
    ]

    operations = [
        migrations.AlterField(
            model_name='batchpostfile',
            name='post',
            field=models.ForeignKey(blank=True, default=None, on_delete=django.db.models.deletion.CASCADE, related_name='batchfile', to='course.batchpost'),
        ),
    ]
