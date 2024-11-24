import { createContext } from "react";

export interface WebSocketContextType {
  sendMessage: (message: string) => void;
  lastMessage: MessageEvent | null;
  readyState: number;
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);
