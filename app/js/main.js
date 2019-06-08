/*
*
* 注意事项：
* 1. mui.plus在网页上运行无效！
*
*
*
* */
class EchartsBarTools {

    constructor(root) {
        this.chart = echarts.init(root);
        this.option = {
            color: ['#3398DB'],

            xAxis: [
                {
                    type: 'category',
                    data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    type: 'bar',
                    data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                }
            ]
        };

        this.chart.setOption(this.option);


    }

    updateScore(scoreArray) {
        let new_score_array = [];
        // 原来的数据过小，显示有异常
        for(var i=0;i<scoreArray.length;i++){
            new_score_array.push(scoreArray[i]*100)
        }
        this.option.series[0].data = new_score_array;

        this.chart.setOption(this.option);
    }
}

class VideoStream {

    constructor(videoElement,
                canvasContext2dElement,
                canvasForNNInputContext2dElement,
                imageWidth,
                imageHeight,
                echartsForShow) {
        //构造函数
        this.video = videoElement;
        this.context2d = canvasContext2dElement;
        this.context2dForNN = canvasForNNInputContext2dElement;
        this.imageW = imageWidth;
        this.imageH = imageHeight;
        this.context2d.width = this.imageW;
        this.context2d.height = this.imageH;
        this.model = new CoreModel();
        this.echartsForShow = echartsForShow;
    }

    static getUserMedia(constraints, success, error) {
        //访问用户媒体设备的兼容方法
        if (navigator.mediaDevices.getUserMedia) {
            //最新的标准API
            navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
        } else if (navigator.webkitGetUserMedia) {
            //webkit核心浏览器
            navigator.webkitGetUserMedia(constraints, success, error)
        } else if (navigator.mozGetUserMedia) {
            //firfox浏览器
            navigator.mozGetUserMedia(constraints, success, error);
        } else if (navigator.getUserMedia) {
            //旧版API
            navigator.getUserMedia(constraints, success, error);
        }
    }

    startProcess(interval = 100) {
        //因为在callback中不支持this，所以需要二次赋值
        let context2d = this.context2d;
        let video = this.video;
        let imageW = this.imageW;
        let imageH = this.imageH;
        let model = this.model;
        let context2dForNN = this.context2dForNN;
        let echartsForShow = this.echartsForShow;

        setInterval(
            function () {
                // 将帧写入图片显示
                context2d.drawImage(video, 0, 0, imageW, imageH);
                // 得到图片
                let imageData = context2d.getImageData(0, 0, imageW, imageH);

                let dataArray = imageData.data;
                // 得到的数据是imageW * imageH * 4的

                // 重要：下面的代码最好参考https://github.com/tensorflow/tfjs-examples/blob/master/mnist/data.js等相关的内容
                // 用于熟悉js中的矩阵操作

                dataArray = new Float32Array(dataArray);
                // 后面几个是shape参数
                dataArray = tf.tensor3d(dataArray, [imageW, imageH, 4]);
                // 计算灰度矩阵
                let greyArray = [];
                // slice第一个是start，第二个是size大小，而不是end！
                let r = dataArray.slice([0, 0, 0], [imageW, imageH, 1]);
                let g = dataArray.slice([0, 0, 1], [imageW, imageH, 1]);
                let b = dataArray.slice([0, 0, 2], [imageW, imageH, 1]);
                //let a = dataArray.slice([0,0,3],[imageW,imageH,1]);
                //console.log(a)
                // 灰度计算的系数
                let v1 = tf.scalar(0.299);
                let v2 = tf.scalar(0.587);
                let v3 = tf.scalar(0.114);
                // 归一化系数
                let v4 = tf.scalar(1.0/255.0);

                // 灰度计算结果，注意使用add，使用加号是不行的！
                let result = tf.add(tf.add(tf.mul(r, v1), tf.mul(g, v2)), tf.mul(b, v3));
                // 然后归一化
                result = tf.mul(result, v4).reshape([1, imageW, imageH, 1]);
                // 注意，reshape的参数是array，不能是单独的int！

                // 使用dataSync来转成array！
                let pred_result = model.predict(result).reshape([10]).dataSync();
                echartsForShow.updateScore(pred_result);
                // console.log(pred_result.slice([0],[1]).array);

            },
            interval
        )
    }

    start() {
        // 启动摄像头并持续获取视频流显示，写入this.video
        //因为在callback中不支持this，所以需要二次赋值
        let video = this.video;

        function onSuccess(stream) {
            //兼容webkit核心浏览器
            let CompatibleURL = window.URL || window.webkitURL;
            //将视频流设置为video元素的源
            console.log(stream);
            //video.src = CompatibleURL.createObjectURL(stream);

            video.srcObject = stream;
            video.play();
        }

        function onError(error) {
            console.log(`访问用户媒体设备失败${error.name}, ${error.message}`);
        }

        if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
            //调用用户媒体设备, 访问摄像头
            VideoStream.getUserMedia({video: {width: 480, height: 320}}, onSuccess, onError);
        } else {
            alert('不支持访问用户媒体');
        }
    }

}


// // -----------主函数-------------

let video1 = document.getElementById('video');
let canvas = document.getElementById('canvas');
let canvasForNNInput = document.getElementById('canvasForNNInput');

var echartTools = new EchartsBarTools(document.getElementById("plot"));

var vs = new VideoStream(
    video1,
    canvas.getContext('2d'),
    canvasForNNInput.getContext('2d'),
    28,
    28,
    echartTools);
vs.start();
vs.startProcess();





