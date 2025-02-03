# H5 新特性

1. 语义话标签
2. audio、vedio
3. webstorage、websorcket、webworker
4. 拖拽（drag）
5. SVG

# WebSocket

基于 TCP 建联，使用 WS 协议，是一个双向通道，
允许服务端主动向客户端推送消息，进行二进制传输。

```ts
// 实例化
const myWorker = new Worker(new URL("./test.ts", import.meta.url)); // 创建 worker

myWorker.postMessage("Greeting from Main.js");

myWorker.onmessage = function (e) {
  console.log(e.data); // 这里可以对接受到的数据进行一些处理
  console.log("Message received from worker");
  myWorker.terminate();
};
myWorker.onerror = (e) => {
  console.log("e", e);
};
```

```ts
// ./test.ts
onmessage = (e) => {
  console.log("e", e);
  const msg = `post-msg-${e.data}`;
  postMessage(msg);
  self.close();
};
```
