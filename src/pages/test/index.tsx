import { useNavigate } from "react-router-dom";
import { test } from "./test";
import Modal from "../../components/dialog";
import { useThrottle } from "../../utils/useThrottle";
import TestStore from "../testStore";
import useTestStore from "../../stores/testStore";
import { useCallback, useEffect, useRef } from "react";

// import { useState } from "react";

const Index = () => {
  test();

  const navgiteTo = useNavigate();
  const bearsAdd = useTestStore((state) => state.bearsAdd);

  const videoRef = useRef<any>(null);
  let cur = 0;
  let frame = 0;
  const frameRate = 30;

  const { run: throttleFn } = useThrottle(() => {
    console.log("cur", performance.now());
  }, 1000);

  const palyNextFrame = () => {
    if (videoRef.current) {
      // video?.play();
      videoRef.current.currentTime = frame / frameRate;
      frame++;
      if (frame <= videoRef.current.duration * frameRate && cur <= 100) {
        setTimeout(() => {
          requestAnimationFrame(palyNextFrame);
        }, 200);
      } else {
        cur = frame = 0;
      }
    }
  };
  // useEffect(() => {
  //   setTimeout(() => {
  //     palyNextFrame();
  //   }, 1000);
  // }, []);

  useEffect(() => {
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
              title: "视频逐帧播放",
              context: (
                <div>
                  <video
                    id="video"
                    ref={videoRef}
                    playsInline
                    controls
                    autoPlay
                    // src="https://web.dev/static/articles/video-and-source-tags/video/web-dev-assets/video-and-source-tags/chrome.webm?hl=zh-cn"
                    src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                    onLoadedMetadata={palyNextFrame}
                  />
                </div>
              )
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
