# Generated by Django 5.0.4 on 2024-07-03 13:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('talent', '0012_address_created_at_address_updated_at_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='companyproducts',
            name='product_type',
            field=models.CharField(choices=[('Software', 'Software'), ('Hardware', 'Hardware'), ('Service', 'Service'), ('Other', 'Other'), ('AI', 'AI')], default='Other', max_length=255),
        ),
    ]
