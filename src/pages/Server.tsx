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
import { useTranslation } from "react-i18next";

export default function Servers() {
  const { t } = useTranslation();
  const { data: groupData } = useQuery({
    queryKey: ["server-group"],
    queryFn: () => fetchServerGroup(),
  });
  const { lastMessage, readyState } = useWebSocketContext();

  const [currentGroup, setCurrentGroup] = useState<string>("All");

  const groupTabs = [
    "All",
    ...(groupData?.data?.map((item: ServerGroup) => item.group.name) || []),
  ];

  useEffect(() => {
    if (readyState == 1) {
      toast.success(t("info.websocketConnected"));
    }
  }, [readyState]);

  if (readyState !== 1) {
    return (
      <div className="flex flex-col items-center justify-center ">
        <p className="font-semibold text-sm">{t("info.websocketConnecting")}</p>
      </div>
    );
  }

  const nezhaWsData = lastMessage
    ? (JSON.parse(lastMessage.data) as NezhaAPIResponse)
    : null;

  if (!nezhaWsData) {
    return (
      <div className="flex flex-col items-center justify-center ">
        <p className="font-semibold text-sm">{t("info.processing")}</p>
      </div>
    );
  }

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
