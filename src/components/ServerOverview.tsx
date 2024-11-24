import { Card, CardContent } from "@/components/ui/card";
import { cn, formatBytes } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type ServerOverviewProps = {
  online: number;
  offline: number;
  total: number;
  up: number;
  down: number;
};

export default function ServerOverview({
  online,
  offline,
  total,
  up,
  down,
}: ServerOverviewProps) {
  const { t } = useTranslation();

  return (
    <>
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className={cn("hover:border-blue-500 transition-all")}>
          <CardContent className="px-6 py-3">
            <section className="flex flex-col gap-1">
              <p className="text-sm font-medium md:text-base">
                {t("serverOverview.totalServers")}
              </p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                </span>
                <div className="text-lg font-semibold">{total}</div>
              </div>
            </section>
          </CardContent>
        </Card>
        <Card
          className={cn(
            " hover:ring-green-500 ring-1 ring-transparent transition-all",
          )}
        >
          <CardContent className="px-6 py-3">
            <section className="flex flex-col gap-1">
              <p className="text-sm font-medium md:text-base">
                {t("serverOverview.onlineServers")}
              </p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>

                <div className="text-lg font-semibold">{online}</div>
              </div>
            </section>
          </CardContent>
        </Card>
        <Card
          className={cn(
            " hover:ring-red-500 ring-1 ring-transparent transition-all",
          )}
        >
          <CardContent className="px-6 py-3">
            <section className="flex flex-col gap-1">
              <p className="text-sm font-medium md:text-base">
                {t("serverOverview.offlineServers")}
              </p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                </span>
                <div className="text-lg font-semibold">{offline}</div>
              </div>
            </section>
          </CardContent>
        </Card>
        <Card
          className={cn(
            " hover:ring-purple-500 ring-1 ring-transparent transition-all",
          )}
        >
          <CardContent className="relative px-6 py-3">
            <section className="flex flex-col gap-1">
              <p className="text-sm font-medium md:text-base">
                {t("serverOverview.totalBandwidth")}
              </p>

              <section className="flex flex-col sm:flex-row pt-[8px] sm:items-center items-start gap-1">
                <p className="text-[12px]  text-nowrap font-semibold">
                  ↑{formatBytes(up)}
                </p>
                <p className="text-[12px] text-nowrap font-semibold">
                  ↓{formatBytes(down)}
                </p>
              </section>
            </section>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
