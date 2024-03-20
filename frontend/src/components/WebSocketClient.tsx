import React, { useEffect, useState } from 'react';

const WebSocketClient: React.FC = () => {
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Connect to the WebSocket server
    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      setWsConnection(ws);
    };

    ws.onmessage = (event) => {
      console.log(`Received message: ${event.data}`);
      setMessage(event.data);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setWsConnection(null);
    };

    return () => {
      // Clean up the WebSocket connection on component unmount
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
      wsConnection.send('Hello from the client!');
    }
  };

  return (
    <div>
      <h1>WebSocket Client</h1>
      <p>Received message: {message}</p>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export default WebSocketClient;
