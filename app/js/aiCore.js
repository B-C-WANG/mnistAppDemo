class CoreModel {
    constructor() {

        this.loadModel()

    }

    save_local_model_files_to_localStorage(){
        // TODO
    }

    async loadModel() {

        this.model = await tf.loadLayersModel(
            // 临时方案，因为网页端运行时会在创建本地server
            'http://127.0.0.1:8848/app/python/tfjs_models/model.json')


    }

    predict(imageInput) {
        // 模型预测的主函数，获取图片输入，灰度和reshape处理，然后输入得到各个类的概率

    }
}