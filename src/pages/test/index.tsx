import { useNavigate } from "react-router-dom";
// import A from "./test";
import { useLayoutEffect } from "react";

// 输入 字符串数组   [ 'avdf','agfd']
// 根据字符串 首字母 归类 {'a': ['agfd','avdf']}

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

console.log("myWorker", myWorker);

const Index = () => {
  const navgiteTo = useNavigate();

  return (
    <div>
      <div>点击</div>

      <button
        id="form"
        onClick={() => {
          navgiteTo("/testContext");
        }}
      >
        跳转
      </button>
    </div>
  );
};

export default Index;
