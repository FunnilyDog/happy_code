import { useLayoutEffect } from "react";

const Index = () => {
  useLayoutEffect(() => {
    let currentTime = 0;

    let video = document.querySelector("video");
    function drawFrame() {
      if (video) {
        video.currentTime = currentTime;
        if (currentTime < video.duration) {
          console.log("1111", video.currentTime, video.duration);
          requestAnimationFrame(drawFrame);
        }
      }
    }
    // video?.addEventListener("loadeddata", drawFrame);
  }, []);
  return (
    <div>
      <h1>vedioPlay</h1>
      <video
        // autoPlay
        // controls
        // onLoadedData={play}
        style={{ width: "400px", height: "400px" }}
        src="https://cdn.pixabay.com/video/2024/11/17/241802_large.mp4"
      ></video>
    </div>
  );
};

export default Index;
