import { useState, useEffect, useRef, useCallback } from "react";

export interface WebSocketHook {
  socket: WebSocket | null;
  connected: boolean;
  message: string | null;
  sendMessage: (msg: string) => void;
}

export default function useWebSocket(url: string): WebSocketHook {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef<number>(0);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const isUnmounted = useRef<boolean>(false);

  const connect = useCallback(() => {
    if (isUnmounted.current) return;

    const ws = new WebSocket(url);
    setSocket(ws);
    socketRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      reconnectAttempts.current = 0;
    };

    ws.onmessage = (event: MessageEvent) => {
      setMessage(event.data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
      // 在错误发生时主动关闭连接，触发重连
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };

    ws.onclose = () => {
      setConnected(false);
      // 清理当前的 socket
      socketRef.current = null;
      
      if (!isUnmounted.current) {
        // 检查是否已经在重连中
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current);
        }
        
        // Attempt to reconnect with increased max attempts
        if (reconnectAttempts.current < 10) {
          const timeout = Math.min(Math.pow(2, reconnectAttempts.current) * 1000, 30000); // 最大30秒
          reconnectAttempts.current += 1;
          console.log(`Attempting to reconnect in ${timeout/1000} seconds...`);
          reconnectTimeout.current = setTimeout(() => {
            connect();
          }, timeout);
        } else {
          console.warn("Max reconnect attempts reached. Please refresh the page to try again.");
        }
      }
    };
  }, [url]);

  useEffect(() => {
    connect();

    return () => {
      isUnmounted.current = true;
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [connect]);

  // Function to send messages
  const sendMessage = useCallback((msg: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(msg);
    } else {
      console.warn(
        "WebSocket is not open. Ready state:",
        socketRef.current?.readyState,
      );
    }
  }, []);

  return { socket, message, sendMessage, connected };
}
