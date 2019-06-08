import os



# tf版本
#os.system('tensorflowjs_converter --input_format=tf_saved_model --output_format=tfjs_graph_model --saved_model_tags=serve ./tf_models ./tfjs_models')
# keras版本
os.system("tensorflowjs_converter --input_format keras --output_format=tfjs_layers_model ./mnist_model_raw.h5 ./tfjs_models")
