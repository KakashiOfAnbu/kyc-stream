import React, { useEffect, useRef, useState } from 'react';

const LiveStream: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const [messageFromServer, setMessageFromServer] = useState('');

  useEffect(() => {
    // Request camera access
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Connect to the WebSocket server
        const ws = new WebSocket('ws://localhost:3000');

        // Set up WebSocket event handlers
        ws.onopen = () => {
          console.log('Connected to WebSocket server');
          setWsConnection(ws);

          // Create a canvas element to capture video frames
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          // Send video frames to the server
          const sendFrame = () => {
            if (videoRef.current && context) {
              canvas.width = videoRef.current.videoWidth;
              canvas.height = videoRef.current.videoHeight;
              context.drawImage(
                videoRef.current,
                0,
                0,
                canvas.width,
                canvas.height,
              );

              // Convert the canvas data to a Base64 string
              const imageData = canvas.toDataURL('image/jpeg');

              // Send the image data to the server
              console.log('Sending frame');
              ws.send(imageData);
              requestAnimationFrame(sendFrame);
            }
          };

          sendFrame(); // Call sendFrame after the connection is opened
        };

        ws.onmessage = (event) => {
          console.log(`Received message from server: ${event.data}`);
          setMessageFromServer(event.data);
        };

        ws.onclose = () => {
          console.log('WebSocket connection closed');
          setWsConnection(null);
        };
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
      });
  }, []);

  return (
    <div>
      <h1>Live Stream</h1>
      <video ref={videoRef} autoPlay playsInline />
      <p>Message from server: {messageFromServer}</p>
    </div>
  );
};

export default LiveStream;
