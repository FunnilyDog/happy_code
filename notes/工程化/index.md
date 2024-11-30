# pnpm npm yarn

pnpm 通过硬链接、冗余移除、压缩存储、并行安装和锁定文件等机制，实现了高效、可共享的依赖管理方式，有效地减少了磁盘空间占用和重复下载的问题，并提高了安装速度

pnpm 使用符号链接 Symbolic link（软链接）来创建依赖项的嵌套结构，将项目的直接依赖符号链接到 node_modules 的根目录，
直接依赖的实际位置在.pnpm/<name>@<version>/node_modules/<name>，
依赖包中的每个文件再硬链接（Hard link）到.pnpm store

npm yarn 会在每个 node_modules 目录为所有依赖项村粗完整文件副本，如果有相同依赖 则会被重复存储。
采用扁平依赖树来管理依赖包，解决依赖嵌套层级过深 以及重复安装 问题

# apply call bind

```javascript
fn.apply(thisObj, [1, 2, 3]);
fn.call(thisObj, 1, 2, 3);
const a = fn.bind(thisObj, 1, 2, 3);
a();
```

# 浏览器内核

## 渲染引擎

    解析HTML、CSS

    Trident: IE浏览器、百度浏览器
    Gecko: Firefox浏览器
    Blink: Opera浏览器、Chrome浏览器、Edge浏览器
    Webkit: Safari浏览器

    解决渲染引擎引起的兼容问题：Normalize.css

## JS 引擎

    常见引擎及所在浏览器
    Chakra:微软开发，用于IE浏览器
    JavaScriptCore:WebKit中的JavaScript引擎，Apple公司开发
    V8:Google开发的强大JavaScript引擎，也帮助Chrome从众多浏览器中脱颖而出

    v8引擎执行过程：
    进行Parser (词法分析，语法分析)成抽象 AST 树
    AST 通过 Ignition（理解成解释器或者转化器）生成 bytecode(字节码)，js 实现跨平台的关键点
    最后根据运行环境，自动将字节码转成对应的汇编代码->机器码，由 CPU 执行

# MVVM MVC MVP

## MVC

    . Model: 主要管理业务模型的数据和行为，它既保存程序的数据，也定义了处理该数据的逻辑
    . View: 接收用户的交互请求并展示数据信息给用户
    . Controller: View 接收到用户的交互请求之后，会将请求转发给 Controller，
      Controller 解析用户的请求之后，就会交给对应的 Model 去处理

## MVP

    三件套各自的职责和依赖关系和变种 MVC 里的职责和依赖关系其实是一样的，
    但不同的是，MVP 之间的交互主要是通过接口实现的，Model、View、Presenter
    都有各自的接口，降低模块之间的耦合性，便于进行单元测试了，维护性和扩展性也提高了。
    但是 需要编写的代码量变多，需要对业务模块之前的交互抽象成借口定义，对开发的设计能力要求高。

## MVVM

    MVVM 最重要的一个特性就是数据绑定，通过将 View 的属性绑定到 ViewModel，
    可以使两者之间松耦合，也完全不需要在 ViewModel 里写代码去直接更新一个 View

    . ViewModel: 视图模型，封装的是视图的表示逻辑和数据，
      是对视图的抽象，包括视图的属性和命令，或视图的状态和行为。

总结: MVP 和 MVVM 都是为了解决界面和数据的分离问题，两者只是采用了不同的实现方案。
MVP 之间的交互主要是通过接口实现的，其主要弊端就是需要编写大量接口。
MVVM 则是通过数据绑定的方式实现交互，虽然其实现需要依赖具体的一些框架工具，
但明显大大减少了开发者需要编写的代码量。
