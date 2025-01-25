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

# apply call bind

```javascript
fn.apply(thisObj, [1, 2, 3]);
fn.call(thisObj, 1, 2, 3);
const a = fn.bind(thisObj, 1, 2, 3);
a();
```

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

# js brage

native -> h5: 向 webview 注入 js 脚本执行
h5 -> native:

1. webview 劫持请求通信
   协议格式： <protocol>://<host>/<path>?<qeury>#fragment
   eg：jsbridge://showToast?text=hello

2. 通过 webview 提供的接口，app 将 Native 相关方法注入到 JS 的全局对象中。

# 深拷贝 处理循环依赖

WeakMap 缓存引用类型，每次引用类型拷贝时先判断是否存在缓存，有则直接用，无则缓存下来。

WeakMap 键值必须为引用对象或 Symbol

## 转 JSON 进行深拷贝弊端

-- Date 类型会被转为字符串
-- RegExp、Map 、Set 类型会被转为 空对象，
-- 拷贝 function 或遇到循环引用时 会报错
-- 对象属性值为 function、undefind、时 会丢失
-- 对象中有 NaN、Infinity 和-Infinity 的时候，序列化之后会显示 null。

# 生成器函数 (手动实现一个 async/await)

```js
// 生成器函数
export function* _async() {
  const userInfo: number = yield getUserInfo();
  console.log("2222", userInfo);
  const name: string = yield () => {
    return "dengxi";
  };
  console.log("name", name);

  const num: number = yield 3;
  console.log("num", num);
}

export const autoRun = (generator: () => Generator<any>) => {
  const gen = generator();

  const next = (data: any) => {
    const result = gen.next(data);
    if (result.done) return;
    if (result.value instanceof Promise) {
      result.value.then((res: any) => {
        next(res);
      });
    } else if (typeof result.value === "function") {
      next(result.value());
    } else {
      next(result.value);
    }
  };
  next(undefined);
};

autoRun(_async);
```

# for 循环 forEach 循环 区别

for 循环： js 自身语法，性能更优，可通过 continue 关键字单次中断，break 关键字 中断整个循环。
forEach 循环：本质是可迭代对象原型方法，执行时会开辟执行栈，因此性能上略逊 for，不可中断，且只能遍历实现了迭代器属性的对象。

在内部执行 async 方法 有什么区别

for 循环内部执行 async 方法时 会等待 await 执行完成后再执行下一次循环。
forEach 循环内部执行 async 方法时 会直接同步执行所有循环后再等待 await 语句执行完成。

forEach 可以中断么？
不可自己中断，可通过抛出异常中断

# Promise

定义: 一个对象有 then 方法且该方法返回一个 promise,有一个状态属性初始为 pending，可转化为 fulfilled 或 rejected 且转化不可逆。（Promise A+ 中定义）

promise 实例方法： then 、catch、finally
promise 原型方法：all、allSettled、race、any、resolve、reject

-- race：接收一个 promise 数组，返回首个状态变更 的 promise。
-- any：接收一个 promise 数组，返回首个状态变更为 resolve 的 Promise 实例。
-- resolve：接收任意参数，返回一个 fulfilled 状态的 promise 实例，resolve 参数为给定参数
-- reject： 接收任意参数，返回一个带有拒绝原因的 Promise 实例。

## Promise.all

接收一个 promise 数组，返回一个 promise，当 promise 数组都成功时，该 promise 变更为 fulfield，若有 promise 失败，则该 promise 也失败并返回第一个失败的原因。

```ts
const p1 = new Promise((res, rej) => {
  setTimeout(() => {
    console.log("11111111");

    res("promise1 成功返回！");
  }, 1000);
});
const p2 = new Promise((res, rej) => {
  setTimeout(() => {
    console.log("22222222");
    res("promise2 成功返回！");
  }, 2000);
});
const p3 = new Promise((res, rej) => {
  setTimeout(() => {
    console.log("3333333");

    res("promise3 reject！");
  }, 3000);
});
const arr = [p1, p2, p3];
const myPromiseAll = (array: Promise<any>[]) => {
  return new Promise((resolve, reject) => {
    let count = 0,
      resList = new Array(array.length);
    array.forEach((item, index) => {
      item.then(
        (res) => {
          resList[index] = res;
          count++;
          if (count === array.length) resolve(resList);
        },
        (err) => reject(err)
      );
    });
  });
};

const myPromiseAllByAwait = (array: Promise<any>[]) => {
  return new Promise((resolve, reject) => {
    let count = 0,
      resList = new Array(array.length);
    try {
      array.forEach(async (item, index) => {
        const res = await item;
        resList[index] = res;
        count++;
        if (count === array.length) resolve(resList);
      });
    } catch (error) {
      reject(error);
    }
  });
};
mapPromiseAll(arr).then(
  (res) => {
    console.log("res", res);
  },
  (rej) => console.log("rej", rej)
);
```

## Promise.allSettled

接收一个 promise 数组，返回一个 promise。当数组中所有 promise 状态都变更后，该 promise 才会变更为 resolve，resolve 参数为该 promise 数组

```ts
const myPromiseAllSettled = (promises: Promise<any>[]) => {
  return new Promise((resolve, reject) => {
    let count = 0,
      resArray = new Array(promises.length);
    promises.forEach((item, idx) => {
      item
        .then(
          (res) => {
            resArray[idx] = {
              status: "fulfilled",
              value: res
            };
          },
          (rej) => {
            resArray[idx] = {
              status: "rejected",
              reason: rej
            };
          }
        )
        .finally(() => {
          count++;
          if (count === promises.length) return resolve(resArray);
        });
    });
  });
};
```

## Promise.retry

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
retry(getProm, 4)
  .then((res) => console.log("res", res))
  .catch((err) => console.log("err", err));
```

# async await

async 函数返回的是一个 Promise 对象
await 返回的是当前语句的执行结果

1. 若当前语句返回一个 promise，则 await 会阻塞后续代码执行 等待当前 promise 状态变更为 resolve，然后得到 resolve 的值作为 await 表达式的运算结果
2. 当前语句返回的不是一个 promise，await 表达式直接将该值作为运算结果。

## 怎么做到同步执行的

只是相对于 当前 async 函数内 后续语句同步 将后续语句包装成异步回调
