import { Card, CardContent } from "@/components/ui/card"
import { useStatus } from "@/hooks/use-status"
import { formatBytes } from "@/lib/format"
import { cn } from "@/lib/utils"
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from "@heroicons/react/20/solid"
import { useTranslation } from "react-i18next"

type ServerOverviewProps = {
  online: number
  offline: number
  total: number
  up: number
  down: number
  upSpeed: number
  downSpeed: number
}

export default function ServerOverview({ online, offline, total, up, down, upSpeed, downSpeed }: ServerOverviewProps) {
  const { t } = useTranslation()
  const { status, setStatus } = useStatus()

  // @ts-expect-error DisableAnimatedMan is a global variable
  const disableAnimatedMan = window.DisableAnimatedMan as boolean

  // @ts-expect-error CustomIllustration is a global variable
  const customIllustration = window.CustomIllustration || "/animated-man.webp"


  return (
    <>
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4 server-overview">
        <Card
          onClick={() => {
            setStatus("all")
          }}
          className="hover:border-primary cursor-pointer transition-all"
        >
          <CardContent className="flex h-full items-center p-6">
            <section className="flex flex-col gap-2">
              <p className="text-sm font-medium text-muted-foreground">{t("serverOverview.totalServers")}</p>
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
                </span>
                <div className="text-2xl font-semibold">{total}</div>
              </div>
            </section>
          </CardContent>
        </Card>
        <Card
          onClick={() => {
            setStatus("online")
          }}
          className={cn(
            "cursor-pointer hover:border-green-500 transition-all",
            {
              "border-green-500": status === "online",
            },
          )}
        >
          <CardContent className="flex h-full items-center p-6">
            <section className="flex flex-col gap-2">
              <p className="text-sm font-medium text-muted-foreground">{t("serverOverview.onlineServers")}</p>
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                </span>
                <div className="text-2xl font-semibold">{online}</div>
              </div>
            </section>
          </CardContent>
        </Card>
        <Card
          onClick={() => {
            setStatus("offline")
          }}
          className={cn(
            "cursor-pointer hover:border-red-500 transition-all",
            {
              "border-red-500": status === "offline",
            },
          )}
        >
          <CardContent className="flex h-full items-center p-6">
            <section className="flex flex-col gap-2">
              <p className="text-sm font-medium text-muted-foreground">{t("serverOverview.offlineServers")}</p>
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                </span>
                <div className="text-2xl font-semibold">{offline}</div>
              </div>
            </section>
          </CardContent>
        </Card>
        <Card className="hover:border-primary transition-all">
          <CardContent className="flex h-full items-center relative p-6">
            <section className="flex flex-col gap-2 w-full">
              <div className="flex items-center w-full justify-between">
                <p className="text-sm font-medium text-muted-foreground">{t("serverOverview.network")}</p>
              </div>
              <section className="flex items-start flex-row gap-2">
                <p className="text-xs text-blue-600 font-medium">↑{formatBytes(up)}</p>
                <p className="text-xs text-purple-600 font-medium">↓{formatBytes(down)}</p>
              </section>
              <section className="flex flex-col sm:flex-row sm:items-center items-start gap-2">
                <p className="text-xs flex items-center font-semibold">
                  <ArrowUpCircleIcon className="size-4 mr-1 text-blue-600" />
                  {formatBytes(upSpeed)}/s
                </p>
                <p className="text-xs flex items-center font-semibold">
                  <ArrowDownCircleIcon className="size-4 mr-1 text-purple-600" />
                  {formatBytes(downSpeed)}/s
                </p>
              </section>
            </section>
            {!disableAnimatedMan && (
              <img
                className="absolute right-3 top-[-40px] z-50 w-12 opacity-80"
                alt={"animated-man"}
                src={customIllustration}
                loading="eager"
              />
            )}
          </CardContent>
        </Card>
      </section>
    </>
  )
}
