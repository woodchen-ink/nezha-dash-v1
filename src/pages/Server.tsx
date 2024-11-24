import { NezhaAPIResponse } from "@/types/nezha-api";
import ServerCard from "@/components/ServerCard";
import { formatNezhaInfo } from "@/lib/utils";
import ServerOverview from "@/components/ServerOverview";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchServerGroup } from "@/lib/nezha-api";
import GroupSwitch from "@/components/GroupSwitch";
import { ServerGroup } from "@/types/nezha-api";
import { useWebSocketContext } from "@/hooks/use-websocket-context";

export default function Servers() {
  const { data: groupData } = useQuery({
    queryKey: ["server-group"],
    queryFn: () => fetchServerGroup(),
  });
  const { lastMessage, readyState } = useWebSocketContext();

  // 添加分组状态
  const [currentGroup, setCurrentGroup] = useState<string>("All");

  // 获取所有分组名称
  const groupTabs = [
    "All",
    ...(groupData?.data?.map((item: ServerGroup) => item.group.name) || []),
  ];

  useEffect(() => {
    if (readyState == 1) {
      toast.success("WebSocket connected");
    }
  }, [readyState]);

  // 检查连接状态
  if (readyState !== 1) {
    return (
      <div className="flex flex-col items-center justify-center ">
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
      <div className="flex flex-col items-center justify-center ">
        <p className="font-semibold text-sm">processing...</p>
      </div>
    );
  }

  // 计算所有服务器的统计数据（用于 Overview）
  const totalServers = nezhaWsData?.servers?.length || 0;
  const onlineServers =
    nezhaWsData?.servers?.filter((server) => formatNezhaInfo(server).online)
      ?.length || 0;
  const offlineServers =
    nezhaWsData?.servers?.filter((server) => !formatNezhaInfo(server).online)
      ?.length || 0;
  const up =
    nezhaWsData?.servers?.reduce(
      (total, server) => total + server.state.net_out_transfer,
      0,
    ) || 0;
  const down =
    nezhaWsData?.servers?.reduce(
      (total, server) => total + server.state.net_in_transfer,
      0,
    ) || 0;

  // 根据当前选中的分组筛选服务器（用于显示列表）
  const filteredServers =
    nezhaWsData?.servers?.filter((server) => {
      if (currentGroup === "All") return true;
      const group = groupData?.data?.find(
        (g: ServerGroup) =>
          g.group.name === currentGroup &&
          Array.isArray(g.servers) &&
          g.servers.includes(server.id),
      );
      return !!group;
    }) || [];

  return (
    <div className="mx-auto w-full max-w-5xl px-0">
      <ServerOverview
        total={totalServers}
        online={onlineServers}
        offline={offlineServers}
        up={up}
        down={down}
      />
      <div className="mt-6">
        <GroupSwitch
          tabs={groupTabs}
          currentTab={currentGroup}
          setCurrentTab={setCurrentGroup}
        />
      </div>
      <section className="grid grid-cols-1 gap-2 md:grid-cols-2 mt-6">
        {filteredServers.map((serverInfo) => (
          <ServerCard key={serverInfo.id} serverInfo={serverInfo} />
        ))}
      </section>
    </div>
  );
}
