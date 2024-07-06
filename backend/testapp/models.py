from django.db import models

from readmin import register


class Model1(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()


class Model2(models.Model):
    title = models.CharField(max_length=50)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class Model3(models.Model):
    status = models.CharField(max_length=20)
    priority = models.IntegerField()
    due_date = models.DateField()


class Model4(models.Model):
    username = models.CharField(max_length=50)
    email = models.EmailField()
    is_active = models.BooleanField(default=True)


class Model5(models.Model):
    code = models.CharField(max_length=10)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)


register([Model1, Model2, Model3, Model4, Model5])
