from django.db import models


class Book(models.Model):
    title = models.CharField(max_length=200)
    image = models.CharField(max_length=200)
    amount = models.PositiveIntegerField(default=1)
    