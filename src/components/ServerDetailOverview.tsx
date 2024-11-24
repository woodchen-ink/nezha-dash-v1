import { BackIcon } from "@/components/Icon";
import { ServerDetailLoading } from "@/components/loading/ServerDetailLoading";
import ServerFlag from "@/components/ServerFlag";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useWebSocketContext } from "@/hooks/use-websocket-context";
import { cn, formatBytes, formatNezhaInfo } from "@/lib/utils";
import { NezhaAPIResponse } from "@/types/nezha-api";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ServerDetailOverview() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { lastMessage, readyState } = useWebSocketContext();

  if (readyState !== 1) {
    return <ServerDetailLoading />;
  }

  const nezhaWsData = lastMessage
    ? (JSON.parse(lastMessage.data) as NezhaAPIResponse)
    : null;

  if (!nezhaWsData) {
    return <ServerDetailLoading />;
  }

  const server = nezhaWsData.servers.find((s) => s.id === Number(id));

  if (!server) {
    return <ServerDetailLoading />;
  }

  const { name, online, uptime, version } = formatNezhaInfo(server);

  return (
    <div>
      <div
        onClick={() => navigate("/")}
        className="flex flex-none cursor-pointer font-semibold leading-none items-center break-all tracking-tight gap-0.5 text-xl"
      >
        <BackIcon />
        {name}
      </div>
      <section className="flex flex-wrap gap-2 mt-3">
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">
                {t("serverDetail.status")}
              </p>
              <Badge
                className={cn(
                  "text-[9px] rounded-[6px] w-fit px-1 py-0 -mt-[0.3px] dark:text-white",
                  {
                    " bg-green-800": online,
                    " bg-red-600": !online,
                  },
                )}
              >
                {online ? t("serverDetail.online") : t("serverDetail.offline")}
              </Badge>
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">
                {t("serverDetail.uptime")}
              </p>
              <div className="text-xs">
                {" "}
                {online ? (uptime / 86400).toFixed(0) : "N/A"} {"Days"}{" "}
              </div>
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">
                {t("serverDetail.version")}
              </p>
              <div className="text-xs">
                {version || t("serverDetail.unknown")}{" "}
              </div>
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">
                {t("serverDetail.arch")}
              </p>
              <div className="text-xs">
                {server.host.arch || t("serverDetail.unknown")}{" "}
              </div>
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">
                {t("serverDetail.mem")}
              </p>
              <div className="text-xs">
                {formatBytes(server.host.mem_total)}
              </div>
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">
                {t("serverDetail.disk")}
              </p>
              <div className="text-xs">
                {formatBytes(server.host.disk_total)}
              </div>
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">
                {t("serverDetail.region")}
              </p>
              <section className="flex items-start gap-1">
                <div className="text-xs text-start">
                  {server.host.country_code?.toUpperCase() ||
                    t("serverDetail.unknown")}
                </div>
                {server.host.country_code && (
                  <ServerFlag
                    className="text-[11px] -mt-[1px]"
                    country_code={server.host.country_code}
                  />
                )}
              </section>
            </section>
          </CardContent>
        </Card>
      </section>
      <section className="flex flex-wrap gap-2 mt-1">
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">
                {t("serverDetail.system")}
              </p>
              {server.host.platform ? (
                <div className="text-xs">
                  {" "}
                  {server.host.platform || t("serverDetail.unknown")} -{" "}
                  {server.host.platform_version}{" "}
                </div>
              ) : (
                <div className="text-xs"> {t("serverDetail.unknown")}</div>
              )}
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">{"CPU"}</p>
              {server.host.cpu ? (
                <div className="text-xs"> {server.host.cpu}</div>
              ) : (
                <div className="text-xs"> {t("serverDetail.unknown")}</div>
              )}
            </section>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
