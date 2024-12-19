# less sass 主题切换

-- 多套主题公共样式
-- 直接切换主题样式文件/修改类名

# canvas 绘图 cdn 图片加载跨域问题

将 html2canvas 的 useCORS 设置为 true；
受访问的服务器必须支持 CORS，也就是以跨域方式获取资源时要返回对应的跨域头；
为 img 标签添加 crossorigin="anonymous" 属性；

# react-route 原理

## history & hash 路由

# 闭包

# css 可替换元素

# 块级元素 行内元素 行内块级元素

猫眼

# eslint 原理

## 渲染流程

-- 初始化：创建 ECharts 实例，初始化配置项和数据。
-- 数据处理：根据配置项和数据生成图表的内部数据结构。
-- 组件渲染：渲染各个组件，如图例、坐标轴、标题等。
-- 图表渲染：根据内部数据结构渲染图表。
-- 事件绑定：绑定交互事件，实现图表的交互功能。

# 组件库 npm 包产物

# echart 实现原理

# canvas

# 单元测试 有写过么

# 工程化了解哪些

# 重复数字字符串修改 n 次使之无重复

eg：111222333 =》 1a12a23a3 // n=3

# csrf 安全问题

作业帮

# render 原理/ 流程

# render 触发条件

# diff 过程中 key 的作用 以及 key 的应用场景

# gui 渲染

# 从输入 url 到 页面绘制

# http1 与 http2 区别

# dom 渲染时 遇到 script 标签 处理逻辑

# 性能优化问题（做过哪些性能优化）

# 用过哪些 webpack loader/plugins

# 按需加载原理

babel-plugin-import 在打包过程中检测 ast 中 对应组件引入位置 更改为 组件绝对路径以及对应样式文件的引入

# lazy 原理

React.lazy() 的原理是基于 React Suspense API，它使用了 JavaScript 中的动态 import() 语法来实现组件的延迟加载。当一个组件被封装在 React.lazy() 中时，Webpack 会将该组件打包成一个单独的代码块（chunk），并且在需要时才会下载和执行这个代码块。
当渲染延迟加载的组件时，React.lazy() 首先检查是否已经加载了该组件所在的代码块。如果还没有加载，则 React.lazy() 返回一个 Promise，该 Promise 将在下载并执行组件代码块后 resolve 并返回加装好的组件。如果已经加载，则直接返回已加载的组件。

# 不需要渲染的 dom 标签 有哪些

 <head /> <script /> css属性带有 display：none

# 页面渲染是同步还是异步的

js 操作 dom 是同步的，浏览器渲染 是异步的
某些布局相关信息属性会导致浏览器强制同步布局生成布局树。
