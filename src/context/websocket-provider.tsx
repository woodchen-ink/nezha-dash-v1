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
  const [needReconnect, setNeedReconnect] = useState(false)
  const ws = useRef<WebSocket | null>(null)
  const reconnectTimeout = useRef<NodeJS.Timeout>(null)
  const maxReconnectAttempts = 30
  const reconnectAttempts = useRef(0)
  const isConnecting = useRef(false)

  const cleanup = () => {
    if (ws.current) {
      // 移除所有事件监听器
      ws.current.onopen = null
      ws.current.onclose = null
      ws.current.onmessage = null
      ws.current.onerror = null

      if (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING) {
        ws.current.close()
      }
      ws.current = null
    }
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current)
      reconnectTimeout.current = null
    }
    setConnected(false)
  }

  const connect = () => {
    if (isConnecting.current) {
      console.log("Connection already in progress")
      return
    }

    cleanup()
    isConnecting.current = true

    try {
      const wsUrl = new URL(url, window.location.origin)
      wsUrl.protocol = wsUrl.protocol.replace("http", "ws")

      ws.current = new WebSocket(wsUrl.toString())

      ws.current.onopen = () => {
        console.log("WebSocket connected")
        setConnected(true)
        reconnectAttempts.current = 0
        isConnecting.current = false
      }

      ws.current.onclose = () => {
        console.log("WebSocket disconnected")
        setConnected(false)
        ws.current = null
        isConnecting.current = false

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
        isConnecting.current = false
      }
    } catch (error) {
      console.error("WebSocket connection error:", error)
      isConnecting.current = false
    }
  }

  const reconnect = () => {
    reconnectAttempts.current = 0
    // 等待一个小延时确保清理完成
    cleanup()
    setTimeout(() => {
      connect()
    }, 1000)
  }

  useEffect(() => {
    connect()

    // 添加页面可见性变化监听
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 页面隐藏时断开连接
        cleanup()
      } else {
        // 页面可见时重新连接
        connect()
      }
    }

    // 添加页面卸载事件监听
    const handleBeforeUnload = () => {
      cleanup()
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      cleanup()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [url])

  const contextValue: WebSocketContextType = {
    lastMessage,
    connected,
    messageHistory,
    reconnect,
    needReconnect,
    setNeedReconnect,
  }

  return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>
}
