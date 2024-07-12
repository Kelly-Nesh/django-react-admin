from typing import Union, List
from .serializer import BaseSerializer
from django.db import models


class ModelNotFoundError(Exception):
    pass


class ModelList:
    __MODELS = {}

    @staticmethod
    def create_key(k):
        if not isinstance(k, models.base.ModelBase):
            if isinstance(k, str):
                msg = f"Registered model should not be a string.\nRemove quotes from \"{k}\"."
            else:
                msg = f"{k} is not of type <class 'django.db.models.base.ModelBase'>"
            raise ValueError(msg)
        return "{}_{}".format(k._meta.app_label, k.__name__.lower())

    @property
    def models(self):
        """Return the list of models"""
        return self.__MODELS

    @models.setter
    def models(self, model_name: Union[str, List[str]]):
        """Add new models to the list of models"""

        if isinstance(model_name, list):
            for i in model_name:
                key = self.create_key(i)
                self.__MODELS[key] = i
        else:
            key = self.create_key(model_name)
            self.__MODELS[key] = model_name

    def register(self,  model_name: Union[str, List[str]]):
        self.models = model_name

    def unregister(self, model_name):
        if isinstance(model_name, list):
            for m in model_name:
                key = self.create_key(m)
                del self.__MODELS[key]
        else:
            key = self.create_key(model_name)
            del self.__MODELS[key]

    def get_model(self, app_name, model_name):
        """Return the model"""
        app_name = app_name.lower()
        model_name = model_name.lower()
        key = "{}_{}".format(app_name, model_name)

        model = self.models.get(key)
        if model:
            return model
        raise ModelNotFoundError(f"{model_name} is not a model")
