# Generated by Django 3.1.1 on 2021-04-20 09:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DICOMImageInfor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.CharField(max_length=200)),
                ('path_image', models.CharField(max_length=200)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('update_at', models.DateTimeField(auto_now=True, null=True)),
                ('deleted', models.BooleanField()),
                ('download_status', models.IntegerField(blank=True, null=True)),
                ('send_status', models.IntegerField(blank=True, null=True)),
                ('owner', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='DICOMSendStatus',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('send_status', models.CharField(max_length=200)),
                ('imagesend_completed', models.CharField(max_length=200)),
                ('imagesend_failed', models.CharField(max_length=200)),
                ('imagesend_Warning', models.CharField(max_length=200)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('update_at', models.DateTimeField(auto_now=True, null=True)),
                ('dicom_image', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='dicomsendstatus', to='image_status.dicomimageinfor')),
            ],
        ),
        migrations.CreateModel(
            name='DICOMDownloadStatus',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('download_status', models.CharField(max_length=200)),
                ('imagedownload_completed', models.CharField(max_length=200)),
                ('imagedownload_failed', models.CharField(max_length=200)),
                ('imagedownload_warning', models.CharField(max_length=200)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('update_at', models.DateTimeField(auto_now=True, null=True)),
                ('dicom_image', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='dicomdownloadstatus', to='image_status.dicomimageinfor')),
            ],
        ),
    ]
