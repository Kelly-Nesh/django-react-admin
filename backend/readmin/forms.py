from typing import List, Union, D

class ModelFormList:
    formlist: dict = {}

    def add(self, model_form: Union[callable, List[callable]]):
        """
        Adds a model form to the ModelFormList instance.

        Args:
            model_form (Union[callable, List[callable]]): A model form or a list of model forms to be added.

        Returns:
            None
        """
        if isinstance(model_form, list):
            for i in model_form:
                self.formlist[i.Meta.model] = i
        else:
            self.formlist[model_form.Meta.model] = model_form

    def register(self,  model_name: callable):
        """
        Decorator to register a model name with the ModelFormList instance.

        Args:
            model_name (callable): An instance of an modelform.

        Returns:
            callable: The registered model name.
        """
        self.formlist[model_name.Meta.model] = model_name
        return model_name

    def get_form(self, model: str, data) -> callable:
        """
        Retrieves a model form from the formlist based on the provided model name.

        Args:
            model (str): The name of the model.
            data: The data to be used as an instance for the model form.

        Returns:
            callable: The model form instance.

        Raises:
            ValueError: If the model does not have a registered model form.
        """
        # print(self.formlist.get(model))
        modelform = self.formlist.get(model)
        if modelform:
            return modelform(instance=data)
        raise ValueError(f"{model} does not have a registered model form")
