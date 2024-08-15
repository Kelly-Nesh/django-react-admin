from typing import List, Union

class ModelFormList:
    formlist = {}

    def add(self, model_form: Union[callable, List[callable]]):
        if isinstance(model_form, list):
            for i in model_form:
                self.formlist[i.Meta.model] = i
        else:
            self.formlist[model_form.Meta.model] = model_form

    def register(self,  model_name: callable):
        self.formlist[model_name.Meta.model] = model_name
        return model_name

    def get_form(self, model: str, data) -> callable:
        # print(self.formlist.get(model))
        modelform = self.formlist.get(model)
        if modelform:
            return modelform(instance=data)
        raise ValueError(f"{model} does not have a registered model form")
