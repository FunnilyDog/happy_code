# Tree Shakig

    利用es module 静态引用的特性，在打包时从entry入口出发扫描所有依赖形成抽象语法树，随后运行所有代码，并打标，最后将没有被用到的代码消除掉。

# new 关键字

```javascript

```

# Promise.retry

```javascript
Promise.retry = (callback, retryTime = 5) => {
  return new Promise((resolve, reject) => {
    callback().then(
      () => {
        resolve(retryTime);
        console.log("retryTime", retryTime);
        return retryTime
      },
      (reason) => {
        if (!retryTime) reject(reason);
        else {
          const p = Promise.retry(callback, --retryTime).then(resolve, reject);
          console.log("p", p);
        }
      }
    );
  });
};
function getProm() {
  const n = Math.random();
  return new Promise((resolve, reject) => {
    setTimeout(() => (n > 0.9 ? resolve(n) : reject(n)), 1000);
  });
}
Promise.retry(getProm).then((res)=> );
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

typeOf NaN === 'number'
instanceOf

# v8 垃圾回收机制

# 深拷贝 处理循环依赖

转 JSON 进行深拷贝会有什么问题

# async await

# ajax fetch

# WebSocket HTTP

# useEffect 第二个参数是对象
