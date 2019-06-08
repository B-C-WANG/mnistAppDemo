# coding:utf-8
'''
如果在window的cmd中遇到pip安装的ssl问题，可以尝试使用bash
注意安装:sudo和非sudo使用的python不同,确认pip安装的时候使用的是哪个pip

FIXME:目前测试导入tensorflowjs失败,于是采用非导入的命令行进行模型转换,见runConvertModel
'''
import tensorflow as tf
import tensorflowjs
class ModelTrainerKeras(object):

    def __init__(self):
        self.model = None
        self.x_train,self.x_test,self.y_test,self.y_train = None,None,None,None

    def build_model(self):
        model = tf.keras.models.Sequential()
        model.add(tf.keras.layers.Conv2D(
            filters=16,
            kernel_size=(5,5),
            padding="same",
            input_shape=(28,28,1),
            activation="relu"
        ))
        model.add(tf.keras.layers.MaxPooling2D(pool_size=(2,2)))
        model.add(tf.keras.layers.Conv2D(
            filters=36,
            kernel_size=(5,5),
            padding="same",
            activation="relu"
        ))
        model.add(tf.keras.layers.MaxPooling2D(pool_size=(2,2)))
        model.add(tf.keras.layers.Flatten())
        model.add(tf.keras.layers.Dense(128,activation="relu"))
        # 分类模型输出层是softmax
        model.add(tf.keras.layers.Dense(10,activation='softmax'))
        model.summary()
        model.compile(loss=tf.keras.losses.categorical_crossentropy,
                      optimizer="adam",
                      metrics=["accuracy"])
        self.model = model

    def prepare_mnist_data(self):
        (x_train,y_train),(x_test,y_test) = tf.keras.datasets.mnist.load_data()
        # reshape和归一化,注意tensorflow js中也有要同样的处理
        self.x_train = x_train.reshape(x_train.shape[0],28,28,1).astype("float32") / 255
        self.x_test = x_test.reshape(x_test.shape[0],28,28,1).astype("float32") / 255

        self.y_train = tf.keras.utils.to_categorical(y_train)
        self.y_test = tf.keras.utils.to_categorical(y_test)

    def train_and_save(self):
        if self.x_train is None:
            raise ValueError("No dataset, please run prepare_mnist_data")
        if self.model is None:
            raise ValueError("No model, please run build_model()")

        try:
            self.model = tf.keras.models.load_model("mnist_model_raw.h5")
            print("Load model success, skip train")
        except:
            print("Failed to load model train again!")
            self.model.fit(
                x=self.x_train,
                y=self.y_train,
                epochs = 10,
                batch_size=256)

            self.model.save("mnist_model_raw.h5")

        # 导出模型到tfjs
        tensorflowjs.converters.save_keras_model(self.model,"./tfjs_models")


class ModelTrainerTF(object):

    def __init__(self):
        self.model = None
        self.x_train,self.x_test,self.y_test,self.y_train = None,None,None,None


    def build_model(self):
        self.input = tf.placeholder(shape=(None,28,28,1),dtype=tf.float32)



        model = tf.keras.layers.Conv2D(
            filters=16,
            kernel_size=(5,5),
            padding="same",
            input_shape=(28,28,1),
            activation="relu"
        )(self.input)

        model = tf.keras.layers.MaxPooling2D(pool_size=(2,2))(model)
        model = tf.keras.layers.Conv2D(
            filters=36,
            kernel_size=(5,5),
            padding="same",
            activation="relu"
        )(model)
        model = tf.keras.layers.MaxPooling2D(pool_size=(2,2))(model)
        model = tf.keras.layers.Flatten()(model)
        model = tf.keras.layers.Dense(128,activation="relu")(model)
        # 分类模型输出层是softmax
        self.output = tf.keras.layers.Dense(10,activation='softmax')(model)

        self.true_output = tf.placeholder(shape=(None,10),dtype=tf.float32)
        self.loss =tf.reduce_mean(tf.nn.sigmoid_cross_entropy_with_logits(logits=self.output, labels=self.true_output))
        self.train_op = tf.train.AdamOptimizer().minimize(self.loss)

    def prepare_mnist_data(self):
        (x_train,y_train),(x_test,y_test) = tf.keras.datasets.mnist.load_data()
        # reshape和归一化,注意tensorflow js中也有要同样的处理
        self.x_train = x_train.reshape(x_train.shape[0],28,28,1).astype("float32") / 255
        self.x_test = x_test.reshape(x_test.shape[0],28,28,1).astype("float32") / 255

        self.y_train = tf.keras.utils.to_categorical(y_train)
        self.y_test = tf.keras.utils.to_categorical(y_test)

    def train_and_save(self):
        if self.x_train is None:
            raise ValueError("No dataset, please run prepare_mnist_data")

        sess = tf.Session()
        sess.run(tf.global_variables_initializer())
        batch_size = 32
        n_batch = self.x_train.shape[0] // batch_size
        for i in range(1):
            for j in range(n_batch):
                print(sess.run([self.train_op,self.loss],feed_dict={
                self.input:self.x_train[j*batch_size:(j+1)*batch_size],
                self.true_output:self.y_train[j*batch_size:(j+1)*batch_size]
                }))
                print("%s/%s"%(j,n_batch))


        # 存储模型
        tf.saved_model.simple_save(sess,"./tf_models",inputs={"input":self.input,},outputs={"output":self.output,})


if __name__ == '__main__':
    model_trainer = ModelTrainerKeras()
    model_trainer.prepare_mnist_data()
    model_trainer.build_model()
    model_trainer.train_and_save()







