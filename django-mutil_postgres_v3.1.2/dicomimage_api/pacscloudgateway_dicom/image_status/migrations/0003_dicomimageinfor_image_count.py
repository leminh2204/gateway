# Generated by Django 3.2.2 on 2021-05-25 09:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('image_status', '0002_dicomimageinfor_patid'),
    ]

    operations = [
        migrations.AddField(
            model_name='dicomimageinfor',
            name='image_count',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]