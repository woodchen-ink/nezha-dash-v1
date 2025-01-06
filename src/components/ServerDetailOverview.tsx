import { BackIcon } from "@/components/Icon"
import ServerFlag from "@/components/ServerFlag"
import { ServerDetailLoading } from "@/components/loading/ServerDetailLoading"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useWebSocketContext } from "@/hooks/use-websocket-context"
import { formatBytes } from "@/lib/format"
import { cn, formatNezhaInfo } from "@/lib/utils"
import { NezhaWebsocketResponse } from "@/types/nezha-api"
import countries from "i18n-iso-countries"
import enLocale from "i18n-iso-countries/langs/en.json"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"

export default function ServerDetailOverview({ server_id }: { server_id: string }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [hasHistory, setHasHistory] = useState(false)

  useEffect(() => {
    const previousPath = sessionStorage.getItem("fromMainPage")
    if (previousPath) {
      setHasHistory(true)
    }
  }, [])

  const { lastMessage, connected } = useWebSocketContext()

  if (!connected && !lastMessage) {
    return <ServerDetailLoading />
  }

  const linkClick = () => {
    if (hasHistory) {
      navigate(-1)
    } else {
      navigate("/")
    }
  }

  const nezhaWsData = lastMessage ? (JSON.parse(lastMessage.data) as NezhaWebsocketResponse) : null

  if (!nezhaWsData) {
    return <ServerDetailLoading />
  }

  const server = nezhaWsData.servers.find((s) => s.id === Number(server_id))

  if (!server) {
    return <ServerDetailLoading />
  }

  const {
    name,
    online,
    uptime,
    version,
    arch,
    mem_total,
    disk_total,
    country_code,
    platform,
    platform_version,
    cpu_info,
    gpu_info,
    load_1,
    load_5,
    load_15,
    net_out_transfer,
    net_in_transfer,
    last_active_time_string,
  } = formatNezhaInfo(nezhaWsData.now, server)

  const customBackgroundImage =
    // @ts-expect-error CustomBackgroundImage is a global variable
    (window.CustomBackgroundImage as string) !== "" ? window.CustomBackgroundImage : undefined

  countries.registerLocale(enLocale)

  return (
    <div
      className={cn({
        "bg-card/70 p-4 rounded-[10px]": customBackgroundImage,
      })}
    >
      <div
        onClick={linkClick}
        className="flex flex-none cursor-pointer font-semibold leading-none items-center break-all tracking-tight gap-1 text-xl server-name"
      >
        <BackIcon />
        {name}
      </div>
      <section className="flex flex-wrap gap-2 mt-3">
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">{t("serverDetail.status")}</p>
              <Badge
                className={cn("text-[9px] rounded-[6px] w-fit px-1 py-0 -mt-[0.3px] dark:text-white", {
                  " bg-green-800": online,
                  " bg-red-600": !online,
                })}
              >
                {online ? t("serverDetail.online") : t("serverDetail.offline")}
              </Badge>
            </section>
          </CardContent>
        </Card>
        {online && (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{t("serverDetail.uptime")}</p>
                <div className="text-xs">
                  {" "}
                  {online ? (uptime / 86400).toFixed(0) : "N/A"} {t("serverDetail.days")}
                </div>
              </section>
            </CardContent>
          </Card>
        )}
        {version && (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{t("serverDetail.version")}</p>
                <div className="text-xs">{version} </div>
              </section>
            </CardContent>
          </Card>
        )}
        {arch && (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{t("serverDetail.arch")}</p>
                <div className="text-xs">{arch} </div>
              </section>
            </CardContent>
          </Card>
        )}

        {mem_total ? (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{t("serverDetail.mem")}</p>
                <div className="text-xs">{formatBytes(mem_total)}</div>
              </section>
            </CardContent>
          </Card>
        ) : null}

        {disk_total ? (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{t("serverDetail.disk")}</p>
                <div className="text-xs">{formatBytes(disk_total)}</div>
              </section>
            </CardContent>
          </Card>
        ) : null}

        {country_code && (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{t("serverDetail.region")}</p>
                <section className="flex items-start gap-1">
                  <div className="text-xs text-start">{countries.getName(country_code?.toUpperCase(), "en")}</div>
                  {country_code && <ServerFlag className="text-[11px] -mt-[1px]" country_code={country_code} />}
                </section>
              </section>
            </CardContent>
          </Card>
        )}
      </section>
      <section className="flex flex-wrap gap-2 mt-1">
        {platform && (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{t("serverDetail.system")}</p>
                <div className="text-xs">
                  {" "}
                  {platform} {platform_version ? " - " + platform_version : ""}
                </div>
              </section>
            </CardContent>
          </Card>
        )}
        {cpu_info.length > 0 && (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{"CPU"}</p>
                <div className="text-xs"> {cpu_info.join(", ")}</div>
              </section>
            </CardContent>
          </Card>
        )}
        {gpu_info.length > 0 && (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{"GPU"}</p>
                <div className="text-xs">{gpu_info.join(", ")}</div>
              </section>
            </CardContent>
          </Card>
        )}
      </section>
      <section className="flex flex-wrap gap-2 mt-1">
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">{"Load"}</p>
              <div className="text-xs">
                {load_1} / {load_5} / {load_15}
              </div>
            </section>
          </CardContent>
        </Card>
        {net_out_transfer ? (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{t("serverDetail.upload")}</p>
                {net_out_transfer ? (
                  <div className="text-xs"> {formatBytes(net_out_transfer)} </div>
                ) : (
                  <div className="text-xs"> {t("serverDetail.unknown")}</div>
                )}
              </section>
            </CardContent>
          </Card>
        ) : null}
        {net_in_transfer ? (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{t("serverDetail.download")}</p>
                {net_in_transfer ? (
                  <div className="text-xs"> {formatBytes(net_in_transfer)} </div>
                ) : (
                  <div className="text-xs"> {t("serverDetail.unknown")}</div>
                )}
              </section>
            </CardContent>
          </Card>
        ) : null}
      </section>
      <section className="flex flex-wrap gap-2 mt-1">
        {server?.state.temperatures && server?.state.temperatures.length > 0 && (
          <section className="flex flex-wrap gap-2 ml-1.5">
            <Accordion type="single" collapsible className="w-fit">
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="text-xs py-0 text-muted-foreground font-normal">{t("serverDetail.temperature")}</AccordionTrigger>
                <AccordionContent className="pb-0">
                  <section className="flex items-start flex-wrap gap-2">
                    {server?.state.temperatures.map((item, index) => (
                      <div className="text-xs flex items-center" key={index}>
                        <p className="font-semibold">{item.Name}</p>: {item.Temperature.toFixed(2)} °C
                      </div>
                    ))}
                  </section>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        )}
      </section>

      <section className="flex flex-wrap gap-2 mt-1">
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">{t("serverDetail.lastActive")}</p>
              <div className="text-xs">{last_active_time_string ? last_active_time_string : "N/A"}</div>
            </section>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
