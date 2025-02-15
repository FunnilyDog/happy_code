import { useEffect, useLayoutEffect } from "react";
import { PersonContext, useHeader } from "../../contexts/personContext";
import { ChildA } from "./childA";
import { ChildB } from "./childB";
import styles from "./index.module.less";
import React from "react";

const Index = () => {
  console.log("test Context component");

  const values = useHeader();
  const channel = new MessageChannel();

  // useLayoutEffect(() => {
  //   const iframe: any = document.getElementsByTagName("iframe")[0];
  //   const onLoad = () => {
  //     console.log("onLoad", onLoad);

  //     iframe.contentWindow.postMessage("main", "*", [channel.port1]);

  //     channel.port2.onmessage = (e) => {
  //       console.log("收到信息", e);
  //       channel.port2.postMessage("hello from Main");
  //     };
  //   };

  //   // iframe.addEventListener("load", onLoad);

  //   return () => {
  //     iframe.removeEventListener("load", onLoad);
  //   };
  // }, [channel.port1, channel.port2]);

  return (
    <PersonContext.Provider value={values}>
      <div className={styles.box}>
        111
        <ChildA />
        <ChildB />
      </div>
      {/* <iframe
        width="1080"
        height="800"
        // frameborder="0"
        src="https://open.douyin.com/player/video?vid=660292215268&autoplay=1"
        referrerPolicy="unsafe-url"
        // allowfullscreen
      ></iframe> */}
    </PersonContext.Provider>
  );
};

const MemoIndex = React.memo(Index, (pre, cur) => {
  console.log("memo arePropsEqual", { pre, cur });
  return true;
});
export default Index;
