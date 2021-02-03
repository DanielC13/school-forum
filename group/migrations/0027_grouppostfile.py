# Generated by Django 3.1.3 on 2020-12-12 15:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('group', '0026_auto_20201210_2320'),
    ]

    operations = [
        migrations.CreateModel(
            name='GroupPostFile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('img', models.FileField(null=True, upload_to='grouppost_file/')),
                ('post', models.ForeignKey(blank=True, default=None, on_delete=django.db.models.deletion.CASCADE, to='group.grouppost')),
            ],
        ),
    ]
