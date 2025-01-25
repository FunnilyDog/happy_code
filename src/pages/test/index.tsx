import { useNavigate } from "react-router-dom";
import { test } from "./test";
import Modal from "../../components/dialog";
import {  useLayoutEffect } from "react";
import { useThrottle } from "../../utils/useThrottle";
// import { useState } from "react";
import { algorithm } from "./algorithm";
const Index = () => {
  // test();
  algorithm();
  const navgiteTo = useNavigate();

  const { run: throttleFn } = useThrottle(() => {
    console.log("cur", performance.now());
  }, 1000);

  // useEffect(()=> {
  //   const worker = new Worker(new URL("./worker.ts", import.meta.url));

  //   worker.onmessage = (e)=> {
  //     console.log('e',e);
  //     worker.terminate()
  //   }
  // },[])

  useLayoutEffect(() => {
    // window.addEventListener("message", (val) => {
    //   console.log("val", val);
    //   const port1 = val.ports[0];
    //   console.log("port1", port1);
    //   port1.postMessage("iframe 发送信息");
    // });
  }, []);
  return (
    <div id="222">
      <div>点击</div>

      <button
        id="form"
        onClick={() => {
          navgiteTo("/testContext");
        }}
      >
        跳转
      </button>

      <input type="text" onChange={throttleFn} />
      <button
        onClick={() => {
          Modal.confirm({
            title: "111",
            context: <div>22222</div>
          });
        }}
      >
        打开弹窗
      </button>
      <div style={{ height: "100vh" }}>高度 100vh</div>
      <div style={{ height: "100vh" }}>高度 100vh</div>
      {/* <Modal visible={visible} show={show} onClose={onClose}>
        <div>1111</div>
      </Modal> */}
    </div>
  );
};

export default Index;
