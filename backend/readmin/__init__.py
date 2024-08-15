from .models import ModelList
from .forms import ModelFormList

model_list = ModelList()
register = model_list.register
unregister = model_list.unregister

model_form_list = ModelFormList()