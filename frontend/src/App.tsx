import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
function App() {
  const [showModal, setShowModal] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (showModal) {
      const videoSrc =
        'https://64f24c11a1bd.ap-northeast-1.playback.live-video.net/api/video/v1/ap-northeast-1.159567387074.channel.J4oraAlf8QMd.m3u8';
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        if (videoRef.current) {
          hls.attachMedia(videoRef.current);
        }
      }
    }
  }, [showModal]);

  const toggle = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <button onClick={toggle}>Toggle</button>
      <br />
      {showModal && (
        <video autoPlay controls ref={videoRef} style={{ height: 300 }}></video>
      )}
    </>
  );
}

export default App;
