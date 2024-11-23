import { useState, useEffect, useRef, useCallback } from "react";

export interface WebSocketHook {
  socket: WebSocket | null;
  connected: boolean;
  onlineCount: number;
  message: string | null;
  sendMessage: (msg: string) => void;
}

export default function useWebSocket(url: string): WebSocketHook {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [onlineCount, setOnlineCount] = useState<number>(0);
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
      const msgJson = JSON.parse(event.data);
      if (msgJson.type === "live") {
        setOnlineCount(msgJson.data.count);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {
      setConnected(false);
      if (!isUnmounted.current) {
        // Attempt to reconnect
        if (reconnectAttempts.current < 5) {
          const timeout = Math.pow(2, reconnectAttempts.current) * 1000; // Exponential backoff
          reconnectAttempts.current += 1;
          reconnectTimeout.current = setTimeout(() => {
            connect();
          }, timeout);
        } else {
          console.warn("Max reconnect attempts reached.");
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

  return { socket, message, sendMessage, connected, onlineCount };
}
