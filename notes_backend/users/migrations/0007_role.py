# Generated by Django 5.0.7 on 2024-07-27 09:33

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0006_alter_signuptoken_user"),
    ]

    operations = [
        migrations.CreateModel(
            name="Role",
            fields=[
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("deleted_at", models.DateTimeField(default=None, null=True)),
                (
                    "id",
                    models.AutoField(primary_key=True, serialize=False, unique=True),
                ),
                ("label", models.TextField(db_index=True)),
                (
                    "permissions",
                    django.contrib.postgres.fields.ArrayField(
                        base_field=models.CharField(
                            choices=[
                                ("view", "View"),
                                ("edit", "Edit"),
                                ("delete", "Delete"),
                            ],
                            max_length=10,
                        ),
                        blank=True,
                        default=list,
                        size=None,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
    ]
