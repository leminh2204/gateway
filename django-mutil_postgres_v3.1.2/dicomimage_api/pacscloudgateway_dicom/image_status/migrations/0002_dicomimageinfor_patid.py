# Generated by Django 3.2 on 2021-04-23 13:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('image_status', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='dicomimageinfor',
            name='patid',
            field=models.CharField(max_length=200, null=True),
        ),
    ]
