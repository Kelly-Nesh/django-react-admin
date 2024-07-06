from typing import Union, List

_MODELS = []


class ModelList:
    def __init__(self):
        global _MODELS
        self._models = _MODELS

    @property
    def models(self):
        """Return the list of models"""
        return self._models

    @models.setter
    def models(self, model_name: Union[str, List[str]]):
        """Add new models to the list of models"""
        if isinstance(model_name, list) or isinstance(model_name, tuple):
            model_name = list(model_name) if isinstance(
                model_name, tuple) else model_name
            self._models.extend(model_name)
        else:
            self._models.append(model_name)

    def register(self,  model_name: Union[str, List[str]]):
        self.models = model_name
