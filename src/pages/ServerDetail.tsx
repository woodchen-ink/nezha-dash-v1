import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { NezhaAPIResponse } from "@/types/nezha-api";

export default function ServerDetail() {
  const { id } = useParams();
  const { lastMessage, readyState } = useWebSocket("/api/v1/ws/server", {
    shouldReconnect: () => true,
    reconnectInterval: 3000,
  });


  // 检查连接状态
  if (readyState !== 1) {
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="font-semibold text-sm">connecting...</p>
      </div>
    );
  }

  // 解析消息
  const nezhaWsData = lastMessage
    ? (JSON.parse(lastMessage.data) as NezhaAPIResponse)
    : null;

  if (!nezhaWsData) {
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="font-semibold text-sm">processing...</p>
      </div>
    );
  }

  const server = nezhaWsData.servers.find(s => s.id === Number(id));

  if (!server) {
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="font-semibold text-sm">Server not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-0">
      <h1 className="text-2xl font-bold mb-4">{server.name}</h1>
      {/* TODO: Add more server details here */}
    </div>
  );
}
