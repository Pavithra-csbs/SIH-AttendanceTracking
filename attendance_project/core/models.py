from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    # Extend default User if needed
    is_student = models.BooleanField(default=False)
    is_teacher = models.BooleanField(default=False)

class Attendance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
    method = models.CharField(max_length=20, choices=[('face', 'Face'), ('qr', 'QR')])
    lat = models.FloatField(null=True, blank=True)
    lon = models.FloatField(null=True, blank=True)
    status = models.CharField(max_length=10, default='present')
