# develAIApp
- 从零开始开发一款手写数字识别的app，作为AI app开发的demo

## 可参考内容
- [https://github.com/tensorflow/tfjs-examples](https://github.com/tensorflow/tfjs-examples)
- [https://www.w3cschool.cn/tensorflowjs/](https://www.w3cschool.cn/tensorflowjs/)
## 主要技术栈
- 使用html5+js+HBuilderX开发基于网页的app，可一次开发，多次部署至网页，iOS，Android等多端
- webStorm作为IDE，HBuilderX在webStorm改动后可以检测到，无缝对接Android Studio，xcode等android，iOS app模拟调试工具
- 前端框架使用mui，尽可能接近h5，使用HBuilder可以直接创建mui的项目代码
## 可选方案
1. 离线方案(模型训练权重+js前端)：使用Python+Tensorflow离线训练模型，使用Tensorflow.js将存储的模型权重载入，然后js提供从摄像头获取数据传入模型给出输出并展示的功能
2. 在线方案(python后端+js前端)：使用Python+Tensorflow训练模型，采用gRPC通信(亦可直接使用websocket+json)，js获取摄像头输出，传给python端的服务器，python后端调用模型处理，得到返回结果传回，然后前端展示

## 开发循环流程
在ide中写代码 -> HBuilderX：运行到浏览器(或安卓iOS模拟器) -> 刷新或者自动刷新查看结果 -> 回到ide
 
# 开发步骤：离线方案
大部分文档可见代码注释
## js部分
1. 完成摄像头图像流获取和显示
2. 间隔一段时间截取图像，按照手写识别模型输入预处理，然后使用tensorflowJs传入模型预测，展示输出
## python部分
强烈建议在linux环境下完成模型训练和导出操作  
- 可以参考[https://www.w3cschool.cn/tensorflowjs/tensorflowjs-uc9p2q2m.html](https://www.w3cschool.cn/tensorflowjs/tensorflowjs-uc9p2q2m.html)来训练模型，保存到Tensorflow.js中然后js使用
- 目前暂时只训练手写数字识别
### debug
- pip安装tensorflowjs时报错找不到相应版本的tf-nightly：先pip install tf-nightly，