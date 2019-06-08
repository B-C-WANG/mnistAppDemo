/*
*
* 注意事项：
* 1. mui.plus在网页上运行无效！
*
*
*
* */

class VideoStream {

    constructor(videoElement, canvasContext2dElement, imageWidth, imageHeight) {
        //构造函数
        this.video = videoElement;
        this.context2d = canvasContext2dElement;
        this.imageW = imageWidth;
        this.imageH = imageHeight;
        this.context2d.width = this.imageW;
        this.context2d.height = this.imageH;
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
        let imageH =this.imageH;
        setInterval(
            function () {
                // 将帧写入图片显示
                context2d.drawImage(video, 0, 0, imageW, imageH);
                // 得到图片
                let imageData = context2d.getImageData(0, 0, imageW, imageH);
                console.log(imageData);
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

var vs = new VideoStream(video1, canvas.getContext('2d'), 40, 40);
vs.start();
vs.startProcess();

// var videoStream = new VideoStream(video);
// videoStream.start();


// TODO：这个设置为interval
// document.getElementById('capture').addEventListener('click', function () {
//     context.drawImage(video, 0, 0, 480, 320);
// })
