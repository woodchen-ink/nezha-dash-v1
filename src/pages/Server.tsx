import { NezhaWebsocketResponse } from "@/types/nezha-api";
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
import { ChartBarSquareIcon } from "@heroicons/react/20/solid";
import { ServiceTracker } from "@/components/ServiceTracker";

export default function Servers() {
  const { t } = useTranslation();
  const { data: groupData } = useQuery({
    queryKey: ["server-group"],
    queryFn: () => fetchServerGroup(),
  });
  const { lastMessage, readyState } = useWebSocketContext();

  const [showServices, setShowServices] = useState(false);
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
    ? (JSON.parse(lastMessage.data) as NezhaWebsocketResponse)
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
      <section className="flex mt-6 items-center gap-2 w-full overflow-hidden">
        <button
          onClick={() => {
            setShowServices(!showServices);
          }}
          className="rounded-[50px] text-white cursor-pointer [text-shadow:_0_1px_0_rgb(0_0_0_/_20%)] bg-blue-600 hover:bg-blue-500 p-[10px] transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[inset_0_1px_0_rgba(0,0,0,0.2)] "
        >
          <ChartBarSquareIcon className="size-[13px]" />
        </button>
        <GroupSwitch
          tabs={groupTabs}
          currentTab={currentGroup}
          setCurrentTab={setCurrentGroup}
        />
      </section>
      {showServices && <ServiceTracker />}
      <section className="grid grid-cols-1 gap-2 md:grid-cols-2 mt-6">
        {filteredServers.map((serverInfo) => (
          <ServerCard key={serverInfo.id} serverInfo={serverInfo} />
        ))}
      </section>
    </div>
  );
}
