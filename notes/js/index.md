# canvas / 图片 相互转化

图片转 canvas： 将图片绘制在 canvas 上( drawImage() ),该方法接受三个参数：要绘制的图像、起始点的 x 坐标和 y 坐标。
eg:

```javascript
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var img = new Image();
img.onload = function () {
  ctx.drawImage(img, 0, 0);
};
img.src = "image.jpg";
```

canvas 转图片：调用 toDataURL()方法将 Canvas 转换为图片的数据 URL。可以将数据 URL 赋值给一个<img>标签的 src 属性，或者使用它进行其他操作，如下载图片。
eg:

```javascript
var canvas = document.getElementById("myCanvas");
var dataURL = canvas.toDataURL("image/png");
```
