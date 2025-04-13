from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    is_admin = models.BooleanField(default=False)
    # Either make it nullable:
    full_name = models.CharField(max_length=100, blank=True, null=True)
    # OR provide a default value:
    # full_name = models.CharField(max_length=100, default='')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    # Remove the duplicate is_admin field
    is_admin = models.BooleanField(default=False)
    

    def __str__(self):
        return self.username


class Media(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_media')
    file = models.FileField(upload_to='uploaded_media/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name
