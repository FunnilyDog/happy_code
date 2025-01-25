import { useEffect } from "react";
import { PersonContext, useHeader } from "../../contexts/personContext";
import { ChildA } from "./childA";
import { ChildB } from "./childB";
import styles from "./index.module.less";

const Index = () => {
  const values = useHeader();
  console.log("Parent values", values);
  const channel = new MessageChannel();

  useEffect(() => {
    const iframe: any = document.getElementsByTagName("iframe")[0];
    const onLoad = () => {
      channel.port2.onmessage = (e) => {
        console.log("收到信息", e);
      };
      iframe.contentWindow.postMessage("main", "*", [channel.port1]);
    };
    iframe.addEventListener("load", onLoad);
  }, [channel.port1, channel.port2]);

  return (
    <PersonContext.Provider value={values}>
      <div className={styles.box}>
        111
        <ChildA />
        <ChildB />
      </div>
      <iframe title="test" src="http://localhost:3001/test" />
    </PersonContext.Provider>
  );
};

export default Index;
