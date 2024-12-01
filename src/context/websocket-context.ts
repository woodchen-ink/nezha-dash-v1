import { createContext } from "react";

export interface WebSocketContextType {
  lastMessage: { data: string } | null;
  connected: boolean;
}

export const WebSocketContext = createContext<WebSocketContextType>({
  lastMessage: null,
  connected: false,
});
