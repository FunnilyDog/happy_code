import { Col, Grid, Row } from "antd";
import flvJs from "flv.js";
import React, { useEffect, useLayoutEffect, useRef } from "react";

const urls = [
  "http://pull-flv-l11.douyincdn.com/third/stream-7468582617022073634_or4.flv?expire=1739524957&major_anchor_level=common&sign=3eb9c8f03b4ee45ae531fccbfe67fdd8&unique_id=stream-7468582617022073634_476_flv_or4",
  "http://pull-f3.douyincdn.com/media/stream-7468591871921556275.flv?auth_key=1739522409-0-0-f108943b9e7b089ada51d7e6c4401e0f&major_anchor_level=common&unique_id=stream-7468591871921556275_684_flv",
  "http://pull-flv-l1.douyincdn.com/stage/stream-7468619157794212644_or4.flv?keeptime=00093a80&major_anchor_level=common&unique_id=stream-7468619157794212644_30_flv_or4&wsSecret=18617bee792441abf8007eada6ac2aa3&wsTime=67a5fd8a",
  "http://pull-hs-f5.flive.douyincdn.com/stage/stream-7468645617953032998_or4.flv?expire=1739536615&major_anchor_level=common&sign=351f9dbd79324de11cf6d96dea48bf49&unique_id=stream-7468645617953032998_682_flv_or4&volcSecret=351f9dbd79324de11cf6d96dea48bf49&volcTime=1739536615"
].filter(Boolean);
const Index = () => {
  const flvRef = useRef<{ url: string; palyer: flvJs.Player | null }[]>(
    urls.map((item) => {
      return {
        url: item,
        palyer: null
      };
    })
  );

  // 视频资源出错，直接卸载
  const handleError = (item: string, idx: number) => {
    console.log("item", item);
    const flvPlayer = flvRef.current[idx].palyer;
    if (flvPlayer) {
      flvPlayer.pause();
      flvPlayer.unload();
      flvPlayer.detachMediaElement();
      flvPlayer.destroy();
      flvRef.current.splice(idx, 1);
    }
  };

  useEffect(() => {
    if (flvJs.isSupported()) {
      console.log("urls", urls);

      urls.forEach((item, idx) => {
        let el = document.getElementById(item);
        flvRef.current[idx].palyer = flvJs.createPlayer({
          type: "flv",
          isLive: true,
          hasAudio: true,
          hasVideo: true,
          url: item
        });
        const flvPlayer = flvRef.current[idx].palyer as flvJs.Player;
        if (el) {
          console.log("flvRef", flvRef);
          flvPlayer.attachMediaElement(el as HTMLMediaElement);
          flvPlayer.load();
          // setTimeout(() => {
          //   flvPlayer.play();
          // }, 2000);
        }
        // 报错
        flvPlayer.on(flvJs.Events.ERROR, function () {
          console.log("2222222222");
        });

        // 流状态变化
        flvPlayer.on(flvJs.Events.STATISTICS_INFO, function (e) {
          if (flvPlayer.muted === true && !e.hasRedirect) {
            console.log("flvPlayer.muted", e);
            flvPlayer.muted = false;
            flvPlayer.play();
          }
        });
        flvPlayer.on(flvJs.Events.LOADING_COMPLETE, () => {
          console.log("直播已结束");
          handleError(item, idx);
        });
      });
    }

    return () => {
      flvRef.current.forEach((item) => {
        if (item.palyer) {
          item.palyer.pause();
          item.palyer.unload();
          item.palyer.detachMediaElement();
          item.palyer.destroy();
        }
      });
    };
  }, []);

  return (
    <div>
      <Row>
        {urls.map((item, idx) => {
          return (
            <Col span={8} key={item}>
              <video
                onError={() => {
                  handleError(item, idx);
                }}
                id={item}
                controls
                autoPlay
                muted
                style={{ width: "100%", height: "100%" }}
              />
            </Col>
          );
        })}
      </Row>

      {/* <video
        ref={videoRef}
        id="videoElement"
        // crossOrigin="anonymous"
        controls
        autoPlay
        // muted
        style={{ width: "100vw", height: " calc(100vh - 6px)" }}
      /> */}
      {/* <iframe src="https://live.douyin.com/587715427131" /> */}
    </div>
  );
};

export default Index;
