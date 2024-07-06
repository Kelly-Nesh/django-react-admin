from django.db import models

from readmin import register


class Subject(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()


class Teacher(models.Model):
    name = models.CharField(max_length=100)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)


class Classroom(models.Model):
    name = models.CharField(max_length=100)
    capacity = models.IntegerField()


class Student(models.Model):
    name = models.CharField(max_length=100)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)


class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    date = models.DateField()


register([Student, Teacher, Classroom, Subject, Attendance])
