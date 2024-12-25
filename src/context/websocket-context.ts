import { createContext } from "react"

export interface WebSocketContextType {
  lastMessage: { data: string } | null
  connected: boolean
  messageHistory: { data: string }[]
}

export const WebSocketContext = createContext<WebSocketContextType>({
  lastMessage: null,
  connected: false,
  messageHistory: [],
})
