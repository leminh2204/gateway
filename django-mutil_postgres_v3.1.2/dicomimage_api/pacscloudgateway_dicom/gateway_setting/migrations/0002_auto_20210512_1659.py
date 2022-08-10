# Generated by Django 3.2.2 on 2021-05-12 09:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('image_status', '0002_dicomimageinfor_patid'),
        ('gateway_setting', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='pacsclientinfor',
            name='dicom_image',
            field=models.ManyToManyField(related_name='pacsclientinfor', to='image_status.DICOMImageInfor'),
        ),
        migrations.AddField(
            model_name='pacscloudinfor',
            name='dicom_image',
            field=models.ManyToManyField(related_name='pacscloudinfor', to='image_status.DICOMImageInfor'),
        ),
    ]
