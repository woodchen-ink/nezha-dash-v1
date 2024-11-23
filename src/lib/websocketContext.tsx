import { createContext, useContext } from "react";
import { WebSocketHook } from "../hooks/use-websocket";

export const WebSocketContext = createContext<WebSocketHook | undefined>(undefined);

export const useWebSocketContext = (): WebSocketHook => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider",
    );
  }
  return context;
};
