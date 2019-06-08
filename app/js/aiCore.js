class CoreModel {
    constructor() {

        this.loadModel()

    }

    async loadModel() {
        this.model = await tf.loadFrozenModel(
            "C:\\github\\develAIApp\\python\\tfjs_models\\model.json",
            "C:\\github\\develAIApp\\python\\tfjs_models\\group1-shard1of1.bin")


    }

    predict(imageInput) {
        // 模型预测的主函数，获取图片输入，灰度和reshape处理，然后输入得到各个类的概率

    }
}