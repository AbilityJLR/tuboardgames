import React, { useState, useEffect, useContext } from 'react';

const WebSocketContext = React.createContext(null);

export const useWebSocket = () => {
  const [webSocket, setWebSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newWebSocket = new WebSocket('ws://localhost:3001');

    newWebSocket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    newWebSocket.onmessage = (event) => {
      setMessages(prevMessages => [...prevMessages, event.data]);
    };

    setWebSocket(newWebSocket);

    return () => {
      newWebSocket.close();
    };
  }, []);

  const sendWebSocketMessage = (message) => {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      webSocket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket connection not established or not open.');
    }
  };

  return { sendWebSocketMessage, messages };
};

export const WebSocketProvider = ({ children }) => {
  const webSocket = useWebSocket();

  return (
    <WebSocketContext.Provider value={webSocket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};
