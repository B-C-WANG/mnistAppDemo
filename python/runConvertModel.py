import os
os.system("tensorflowjs_converter --input_format keras ./mnist_model_raw.h5 ./tfjs_models")
