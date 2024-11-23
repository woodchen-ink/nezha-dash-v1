import useWebSocket from "react-use-websocket";
import { NezhaAPIResponse } from "@/types/nezha-api";
import ServerCard from "@/components/ServerCard";
import { formatNezhaInfo } from "@/lib/utils";
import ServerOverview from "@/components/ServerOverview";

export default function Servers() {
  const { lastMessage, readyState } = useWebSocket("/api/v1/ws/server", {
    shouldReconnect: () => true, // 自动重连
    reconnectInterval: 3000, // 重连间隔
  });

  // 检查连接状态
  if (readyState !== 1) {
    return null;
  }

  // 解析消息
  const nezhaWsData = lastMessage
    ? (JSON.parse(lastMessage.data) as NezhaAPIResponse)
    : null;

  if (!nezhaWsData) {
    return (
      <div className="flex flex-col items-center justify-center ">
        <p className="font-semibold text-sm">等待数据...</p>
      </div>
    );
  }

  // 计算服务器总数和在线数量
  const totalServers = nezhaWsData.servers.length;
  const onlineServers = nezhaWsData.servers.filter(
    (server) => formatNezhaInfo(server).online,
  ).length;
  const offlineServers = nezhaWsData.servers.filter(
    (server) => !formatNezhaInfo(server).online,
  ).length;
  const up = nezhaWsData.servers.reduce(
    (total, server) => total + server.state.net_out_transfer,
    0,
  );
  const down = nezhaWsData.servers.reduce(
    (total, server) => total + server.state.net_in_transfer,
    0,
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-0">
      <ServerOverview
        total={totalServers}
        online={onlineServers}
        offline={offlineServers}
        up={up}
        down={down}
      />
      <section className="grid grid-cols-1 gap-2 md:grid-cols-2 mt-6">
        {nezhaWsData.servers.map((serverInfo) => (
          <ServerCard key={serverInfo.id} serverInfo={serverInfo} />
        ))}
      </section>
    </div>
  );
}
