import { ReactNode } from "react";
import useWebSocket from "../hooks/use-websocket";
import { WebSocketContext } from "./websocketContext";

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const ws = useWebSocket('/api/v1/ws/server');
  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  );
};
