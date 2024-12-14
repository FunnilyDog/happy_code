# Tree Shakig

    利用es module 静态引用的特性，在打包时从entry入口出发扫描所有依赖形成抽象语法树，随后运行所有代码，并打标，最后将没有被用到的代码消除掉。

# new 关键字

. 创建一个空对象
. 将新对象的**proto** 赋值为构造函数的 prototype
. 将构造函数中的 this 指向该对象
. 执行构造函数，如果构造函数返回引用数据类型 则直接返回该对象，否则返回新对象。

```javascript
function Person(name: any) {
  this.name = name;
  return { name };
}
function Person2(name: any) {
  this.name = name;
}

Person.prototype = {
  sayHello() {
    console.log("hello");
  }
};

const person = new Person("aa");
const person2 = new Person2("bb");

// Person 返回了引用类型 new 直接将引用类型返回 即 person 是用字面量形式创建的对象,其构造函数为Object
console.log(person.__proto__ === Object.prototype); // true
// Person2 没有返回值，new 将创建的新对象返回，该对象的__proto__ 指向构造函数Person2的prototype
console.log(person2.__proto__ === Person2.prototype); // true

console.log(person.constructor === Object); // true
```

# Promise.retry

```javascript
const retry = (callback: () => Promise<any>, retryTime = 5) => {
  return new Promise((resolve, reject) => {
    callback().then(
      () => {
        resolve(retryTime);
      },
      (reason: any) => {
        if (!retryTime) reject(reason);
        else {
          retry(callback, --retryTime).then(resolve, reject);
        }
      }
    );
  });
};
function getProm() {
  const n = Math.random();
  return new Promise((resolve, reject) => {
    setTimeout(() => (n > 1 ? resolve(n) : reject(n)), 100);
  });
}
retry(getProm)
  .then((res) => console.log("res", res))
  .catch((err) => console.log("err", err));
```

# 给定一个数组，和一个目标值， 寻找数组中 最接近目标值 的 两数之和 返回两数下标

```typescript
const findNum = (nums: number[], target: number) => {
  const len = nums.length;
  let resultSum = Infinity;
  let resL = [];
  for (let l = 0; l < len; l++) {
    for (let r = len - 1; r > l; r--) {
      const sum = nums[l] + nums[r];
      if (sum === target) return [l, r];
      const res = Math.min(
        Math.abs(sum - target),
        Math.abs(resultSum - target)
      );
      if (res === Math.abs(sum - target)) {
        resL = [l, r];
        resultSum = sum;
      }
    }
  }
  return resL;
};
```

# js 类型判断

## instanceOf

语法：obj instanceof Type
功能：判断 obj 是不是 Type 类的实例，只可用来判断引用数据
实现思路： Type 的原型对象是否是 obj 的原型链上的某个对象

```ts
Function.prototype.myInstanceOf = function (fuc: Function) {
  let proto = (this as Object).__proto__;
  const pt = fuc.prototype;
  while (proto) {
    if (pt === proto) return true;
    proto = proto.__proto__;
  }
  return false;
};
```

## Object.prototype.toString

```ts
function typeOf(data) {
  return Object.prototype.toString.call(data).slice(8, -1);
}
```

# 垃圾回收机制

## 浏览器垃圾回收机制

引用计数:
跟踪记录每个引用类型被使用的次数，赋值+1，变更-1，当引用计数为 0 时被回收

弊端：循环引用将不可被清除、需要开辟新内存存储引用计数

标记清除：
为程序中所有的变量添加上一个二进制字符(二进制运算最快)并初始值置为 0(默认全是垃圾)，然后遍历所有的对象，被使用的变量标记置为 1，所有被标记置为 1 的变量所引用的变量也置为 1，在程序运行结束时回收掉所有标记为零的变量，回收结束之后将现存变量标记统一置为 0，等待下一轮回收开启。

弊端：耗时，产生内存碎片

## V8 垃圾回收优化

### 分代式

V8 将内存空间划分为 新生代 和 老生代
. 新生代存储新产生的(存活时间较短)较小的对象，其内存空间通常只有 1 ～ 8M
. 新生代会被拆分为使用区和空闲区，新的对象都会被分配到使用区，当使用区快满时则进行新生代区域的垃圾回收：
对使用区的活动对象进行标记，标记完成后将活跃对象复制到空闲区并排序，随后对使用区进行清理，最后将使用区与空闲区对换。

· 当一个对象被多次复制还未被清理掉，故此对象会被认定为生命周期较长的对象，会被从新生代移动到老生代中
· 老生代存储着较大或生命周期较长的对象，对老生代垃圾回收则使用标记整理算法

### 优化

-- V8 在垃圾回收时会同时开启多个辅助线程进行并行回收
-- V8 会在标记阶段采用三色标记法进行切片处理（标记开始时所有对象都为白色，从跟对象开始将可达位置标记为灰色，若中断标记，后续直接从灰色继续开始同时将灰色置为黑色同时将下一代对象置为灰色，直至无可标记为灰色对象为止便 开始清除），为保障切片过程中已标记过的对象产生的新对象未被标记，会强制判断一旦有黑色的对象引用白色的对象，就会强制将被引用的白色变量标记为灰色。

-- V8 标记完成后，如果内存足够便不会立即进行清理。

# 深拷贝 处理循环依赖

WeakMap 缓存引用类型，每次引用类型拷贝时先判断是否存在缓存，有则直接用，无则缓存下来。

WeakMap 键值必须为引用对象或 Symbol

## 转 JSON 进行深拷贝弊端

-- Date 类型会被转为字符串
-- RegExp、Map 、Set 类型会被转为 空对象，
-- 拷贝 function 或遇到循环引用时 会报错
-- 对象属性值为 function、undefind、时 会丢失
-- 对象中有 NaN、Infinity 和-Infinity 的时候，序列化之后会显示 null。

# useEffect 依赖引用类型

更新时会被重新分配地址导致每次更新时都会执行 useEffect

# ajax fetch

## ajax

```ts
const xhr = new XMLHttpRequest(); // 创建 xhr 操作对象 readyState = 0
xhr.open("get", "http://jsonplaceholder.typicode.com/posts/2"); // 建立请求 readyState = 1
xhr.setRequestHeader("name", "123");
xhr.send(/\*_ 请求体可以放这里 _/); // 发送请求 readyState = 2
xhr.onreadystatechange = () => {
  // readyState = 3 说明正在接收服务器传来的 body 部分的数据
  if (xhr.readyState === 4 && xhr.status === 200) {
    // readyState = 4 说明数据完全接收
    console.log(xhr.response);
  }
};
xhr.onprogress = (p) => {
  if (p.lengthComputable) {
    // 表示底层流程将需要完成的总工作量和已经完成的工作量是否可以计算
    console.log(p.total); // 表示正在执行的底层流程的工作总量
    console.log(p.loaded); // 表示底层流程已经执行的工作总量
  }
};
```

## fetch

-- 请求实例

```ts
fetch("http://jsonplaceholder.typicode.com/posts", {
  //请求方法
  method: "POST",
  //请求头
  headers: {
    name: "zhang"
  },
  //请求体
  body: JSON.stringify({
    id: 1
  })
})
  .then((response) => {
    return response.json();
  })
  .then((response) => {
    console.log(response);
  });
```

-- 中断请求：

```ts
const controller = new AbortController();
const { signal } = controller;
fetch("http://", { signal });
controller.abort();
```

## 区别

-- fetch 使用 promise、 XMLHttpRequest 则使用回调的方式(需要开发手动包装 promise)
-- fetch 只有在中断请求或网络故障或配置错误时才会被标记 reject，其他时候都是 resolve；XHR 则需要在 onReadyStateChange 回调里自行判断
-- XHR 拥有 onProgress 回调监控传输进度
-- fetch 将请求分成了多个模型（Request、Responce、Headers）; XMLHttpRequest 只有一个自己的实例。
-- fetch 通过数据流处理数据，可以分块读取；XMLHTTPRequest 对象不支持数据流，所有的数据必须放在缓存里，不支持分块读取，必须等待全部拿到后，再一次性吐出来

# WebSocket

基于 TCP 建联，使用 WS 协议，是一个双向通道，
允许服务端主动向客户端推送消息，进行二进制传输。

```ts
// 实例化
const myWebSocket = newWebSocket(url [, protocols]);
```

# 跨域

什么是跨域： 请求 url 的协议 域名 端口 中任意一个与当前页面 url 不同即为跨域
原因： 浏览器的同源策略规定非同源请求不能被浏览器所接受以防止 xss csrf 攻击

解决方案：

## 跨域资源共享（CORS）

-- 简单请求 浏览器会自动带上 Origin 请求头 服务器端验证 Origin 在白名单内则返回时添加 Access-Control-Allow-Origin 响应头告诉浏览器 允许该 Origin 访问
简单请求判断标准：
a. 请求方法为 GET、POST、HEAD
b. 请求头只允许出现 CORS 安全规范定义的标头集合
c. 请求中没有使用 ReadableStream 对象

-- 非简单请求则需要在正式发起请求前进行 OPTIONS 预请求，该请求携带 Origin、Access-Control-Request-Method、Access-Control-Request-Headers 等请求头以便服务器验证是否允许实际请求。

## 代理服务器

## JSONP & window.name

# ES6 新特性

1. 块级作用域 let const 无变量提升 const 创建变量不可更改
2. 箭头函数
3. 解构赋值与扩展运算符

```ts
// 解构赋值
const { name, age } = obj;
// 扩展运算符
const a = [...arr];
const b = { ...obj };
```

4. promise 与 生成器函数
5. proxy

ps:Object.defineProperty 比较
-- df 只能单独定义某个属性，要代理整个对象需要遍历对象，分别代理，数组也是如此；proxy 可以代直接理整个对象。
-- df 在原对象上处理，proxy 则新创建代理对象在代理对象上进行处理
-- proxy 实质创建了一个异质对象，在异质对象中的所有操作

```ts
Object.defineProperty(obj, prop, descriptor);
const proxy = new Proxy(target, handler);
```

6.

# H5 新特性

1. 语义话标签
2. audio、vedio
3. webstorage、websorcket、webworker
4. 拖拽（drag）
5. SVG

# less sass 主题切换

-- 多套主题公共样式
-- 直接切换主题样式文件/修改类名

# js brage

native -> h5: 向 webview 注入 js 脚本执行
h5 -> native:

1. webview 劫持请求通信
   协议格式： <protocol>://<host>/<path>?<qeury>#fragment
   eg：jsbridge://showToast?text=hello

2. 通过 webview 提供的接口，app 将 Native 相关方法注入到 JS 的全局对象中。

# canvas 绘图 cdn 图片加载跨域问题

将 html2canvas 的 useCORS 设置为 true；
受访问的服务器必须支持 CORS，也就是以跨域方式获取资源时要返回对应的跨域头；
为 img 标签添加 crossorigin="anonymous" 属性；

# HOC hook renderProps

HOC 纯函数 接收一个组件 对组件功能进行增强 返回增强后组件
render props: 将一个函数作为 prop 传递给一个组件，而这个函数用来返回要渲染的 UI。通过这种方式，父组件可以控制子组件渲染的内容，同时还能实现灵活的逻辑复用

# react-route 原理

## history & hash 路由

# react fiber

Fiber 是一个 JavaScript 对象，代表 React 的一个工作单元，它包含了与组件相关的信息

# setState 原理
