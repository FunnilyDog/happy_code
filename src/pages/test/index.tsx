import { useNavigate } from "react-router-dom";
import { test } from "./test";
import Modal from "../../components/dialog";
import { useThrottle } from "../../utils/useThrottle";
import TestStore from "../testStore";
import useTestStore from "../../stores/testStore";
import { useCallback, useEffect } from "react";
import { largeArr } from "./data";
// import { useState } from "react";

const Index = () => {
  test();

  const navgiteTo = useNavigate();
  const bearsAdd = useTestStore((state) => state.bearsAdd);

  const { run: throttleFn } = useThrottle(() => {
    console.log("cur", performance.now());
  }, 1000);

  const logFun = useCallback(() => {
    console.log("222222");
  }, []);

  const getRes = () => {
    let res = 0;
    for (let i = 0; i < largeArr.length; i++) {
      res += largeArr[i];
    }
    console.log("res", res);

    return res;
  };

  useEffect(() => {
    getRes();
    const fun = (event: any) => {
      if (event.data === "main" && event.ports[0]) {
        const port = event.ports[0];
        console.log("port", port);

        port.postMessage("Hello from iframe!");
        // 监听 port 的消息
        port.onmessage = (event: any) => {
          console.log("Received message from parent:", event.data);
          // port.postMessage("Hello from iframe!");
        };
      }
    };
    window.onmessage = fun;
  }, []);

  useEffect(() => {
    logFun();
  }, [bearsAdd, logFun]);

  return (
    <>
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
      </div>
      <button onClick={() => bearsAdd(11)}>add bears</button>
      <TestStore />
    </>
  );
};

export default Index;
