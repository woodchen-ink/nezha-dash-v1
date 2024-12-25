import React, { useEffect, useRef, useState } from "react"

import { WebSocketContext, WebSocketContextType } from "./websocket-context"

interface WebSocketProviderProps {
  url: string
  children: React.ReactNode
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ url, children }) => {
  const [lastMessage, setLastMessage] = useState<{ data: string } | null>(null)
  const [messageHistory, setMessageHistory] = useState<{ data: string }[]>([]) // 新增历史消息状态
  const [connected, setConnected] = useState(false)
  const ws = useRef<WebSocket | null>(null)
  const reconnectTimeout = useRef<NodeJS.Timeout>(null)
  const maxReconnectAttempts = 30
  const reconnectAttempts = useRef(0)

  const connect = () => {
    try {
      const wsUrl = new URL(url, window.location.origin)
      wsUrl.protocol = wsUrl.protocol.replace("http", "ws")

      ws.current = new WebSocket(wsUrl.toString())

      ws.current.onopen = () => {
        console.log("WebSocket connected")
        setConnected(true)
        reconnectAttempts.current = 0
      }

      ws.current.onclose = () => {
        console.log("WebSocket disconnected")
        setConnected(false)

        // 重连逻辑
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectTimeout.current = setTimeout(() => {
            reconnectAttempts.current++
            connect()
          }, 3000)
        }
      }

      ws.current.onmessage = (event) => {
        const newMessage = { data: event.data }
        setLastMessage(newMessage)
        // 更新历史消息，保持最新的30条记录
        setMessageHistory((prev) => {
          const updated = [newMessage, ...prev]
          return updated.slice(0, 30)
        })
      }

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error)
      }
    } catch (error) {
      console.error("WebSocket connection error:", error)
    }
  }

  useEffect(() => {
    connect()

    return () => {
      if (ws.current) {
        ws.current.close()
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current)
      }
    }
  }, [url])

  const contextValue: WebSocketContextType = {
    lastMessage,
    connected,
    messageHistory, // 添加到 context value
  }

  return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>
}
