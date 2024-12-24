# less sass 主题切换

-- 多套主题公共样式
-- 直接切换主题样式文件/修改类名

# canvas 绘图 cdn 图片加载跨域问题

将 html2canvas 的 useCORS 设置为 true；
受访问的服务器必须支持 CORS，也就是以跨域方式获取资源时要返回对应的跨域头；
为 img 标签添加 crossorigin="anonymous" 属性；

# 闭包

内部方法引用外部变量。
适用场景： 防抖节流

# css 可替换元素

-- <img> <video> <iframe>
特点：CSS 可以影响可替换元素的位置，但不会影响到可替换元素自身的内容

# 块级元素 行内元素 行内块级元素

行内块级元素： <button> <input> <textarea> <select>
特点： 即可设置宽度，也可设置高度 行高等

# 不需要渲染的 dom 标签 有哪些

 <head /> <script /> css属性带有 display：none

# 页面渲染是同步还是异步的

js 操作 dom 是同步的，浏览器渲染 是异步的
某些布局相关信息属性会导致浏览器强制同步布局生成布局树。

# 函数组件 和 类组件 优缺点

函数组件没有 this ，相对类组件 更加独立 不需要继承 clas，更少的模版代码，复用性 与可维护性更强。

# react diff 过程

# react-route 原理

## history & hash 路由

hash 路由通过监听锚点变更触发 callback 实现路由切换
history 路由通过 h5 出的 全局 history 对象 处理 url，并阻止

# 长安 一面

## 性能指标

## 性能优化

## 自己实现一个埋点上报 sdk 的思路

## 埋点上报性能优化思路

1.  图片请求（Image Beacon）：通过创建一个 Image 对象，将要上报的数据作为 URL 参数拼接到一个 1x1 像素的透明图片 URL 中，发送一个 GET 请求来触发上报。

2.  Navigator.sendBeacon()：Navigator.sendBeacon()方法允许在页面卸载时异步发送数据。它通常用于在页面关闭时进行最后的数据上报，以确保数据能够成功发送。

# 马上消费

## shell 脚本

## JSX 编译过程

## useState useReducer 有什么异同即实现原理

useState mount update 阶段返回内容是否一致？

## 实现一个方法组件调用弹窗 返回 promise 当 点击确认/取消 时 该 promise 状态变更返回具体操作类型

## 打包时将静态资源图片上传至 oss 服务器并将对应位置替换为 oss 服务器返回的图片链接，已上传图片则直接替换不重复上传。 （loader

## 鼠标 hover 到第一个子 div，第二个子 div 更改背景色 -> 这样的组件有一百个时怎么实现(css 伪选择器)

```html
<div>
  <div></div>
  <div></div>
</div>
```

## 为什么 类组件 和 函数组件 可以混合使用

## 自定义 hook

## 防抖 节流

## webpack compiler & compilation

有一个实例还是多个

## ts pick omit

## 怎么约束 T 是 string 或 number

## 重写了 axios 只返回 response.data 这时候 ts 会报错 怎么解决
