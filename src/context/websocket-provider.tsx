import React from "react";
import {
  WebSocketContext,
  type WebSocketContextType,
} from "./websocket-context";
import useWebSocket from "react-use-websocket";

interface WebSocketProviderProps {
  url: string;
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  url,
  children,
}) => {
  const { sendMessage, lastMessage, readyState } = useWebSocket(url, {
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    shouldReconnect: () => true,
  });

  const contextValue: WebSocketContextType = {
    sendMessage,
    lastMessage,
    readyState,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};
