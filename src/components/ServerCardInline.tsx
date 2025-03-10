import ServerFlag from "@/components/ServerFlag"
import ServerUsageBar from "@/components/ServerUsageBar"
import { formatBytes, formatUptime } from "@/lib/format"
import { GetFontLogoClass, GetOsName, MageMicrosoftWindows } from "@/lib/logo-class"
import { cn, formatNezhaInfo, parsePublicNote } from "@/lib/utils"
import { NezhaServer } from "@/types/nezha-api"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import PlanInfo from "./PlanInfo"
import BillingInfo from "./billingInfo"
import { Card } from "./ui/card"
import { Separator } from "./ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

export default function ServerCardInline({ now, serverInfo }: { now: number; serverInfo: NezhaServer }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { 
    name, 
    country_code, 
    online, 
    cpu, 
    up, 
    down, 
    mem, 
    stg, 
    platform, 
    uptime, 
    net_in_transfer, 
    net_out_transfer, 
    public_note,
    cpu_info,
    mem_total,
    disk_total,
    tcp,
    udp,
    process
  } = formatNezhaInfo(
    now,
    serverInfo,
  )

  const cardClick = () => {
    sessionStorage.setItem("fromMainPage", "true")
    navigate(`/server/${serverInfo.id}`)
  }

  const showFlag = true

  const customBackgroundImage = (window.CustomBackgroundImage as string) !== "" ? window.CustomBackgroundImage : undefined

  // @ts-expect-error ShowServerDetails is a global variable
  const showServerDetails = window.ShowServerDetails !== undefined ? window.ShowServerDetails as boolean : true

  const parsedData = parsePublicNote(public_note)

  return online ? (
    <section>
      <Card
        className={cn(
          "flex items-center lg:flex-row justify-start gap-3 p-3 md:px-5 cursor-pointer hover:bg-accent/50 transition-colors min-w-[900px] w-full",
          {
            "bg-card/70": customBackgroundImage,
          },
        )}
        onClick={cardClick}
      >
        <section className={cn("grid items-center gap-2 lg:w-36")} style={{ gridTemplateColumns: "auto auto 1fr" }}>
          <span className="h-2 w-2 shrink-0 rounded-full bg-green-500 self-center"></span>
          <div className={cn("flex items-center justify-center", showFlag ? "min-w-[17px]" : "min-w-0")}>
            {showFlag ? <ServerFlag country_code={country_code} /> : null}
          </div>
          <div className="relative w-28 flex flex-col">
            <p className={cn("break-all font-bold tracking-tight", showFlag ? "text-xs " : "text-sm")}>{name}</p>
            {parsedData?.billingDataMod && <BillingInfo parsedData={parsedData} />}
          </div>
        </section>
        <Separator orientation="vertical" className="h-8 mx-0 ml-2" />
        <div className="flex flex-col gap-1">
          <section className={cn("grid grid-cols-9 items-center gap-3 flex-1")}>
            <div className={"items-center flex flex-row gap-2 whitespace-nowrap"}>
              <div className="text-xs font-semibold">
                {platform.includes("Windows") ? (
                  <MageMicrosoftWindows className="size-[10px]" />
                ) : (
                  <p className={`fl-${GetFontLogoClass(platform)}`} />
                )}
              </div>
              <div className={"flex w-14 flex-col"}>
                <p className="text-xs text-muted-foreground">{t("serverCard.system")}</p>
                <div className="flex items-center text-[10.5px] font-semibold">{platform.includes("Windows") ? "Windows" : GetOsName(platform)}</div>
              </div>
            </div>
            <div className={"flex w-20 flex-col"}>
              <p className="text-xs text-muted-foreground">{t("serverCard.uptime")}</p>
              <div className="flex items-center text-xs font-semibold">
                {uptime / 86400 >= 1
                  ? `${(uptime / 86400).toFixed(0)} ${t("serverCard.days")}`
                  : `${(uptime / 3600).toFixed(0)} ${t("serverCard.hours")}`}
              </div>
            </div>
            <div className={"flex w-14 flex-col"}>
              <p className="text-xs text-muted-foreground">{"CPU"}</p>
              <div className="flex items-center text-xs font-semibold">{cpu.toFixed(2)}%</div>
              <ServerUsageBar value={cpu} />
            </div>
            <div className={"flex w-14 flex-col"}>
              <p className="text-xs text-muted-foreground">{t("serverCard.mem")}</p>
              <div className="flex items-center text-xs font-semibold">{mem.toFixed(2)}%</div>
              <ServerUsageBar value={mem} />
            </div>
            <div className={"flex w-14 flex-col"}>
              <p className="text-xs text-muted-foreground">{t("serverCard.stg")}</p>
              <div className="flex items-center text-xs font-semibold">{stg.toFixed(2)}%</div>
              <ServerUsageBar value={stg} />
            </div>
            <div className={"flex w-16 flex-col"}>
              <p className="text-xs text-muted-foreground">{t("serverCard.upload")}</p>
              <div className="flex items-center text-xs font-semibold">
                {up >= 1024 ? `${(up / 1024).toFixed(2)}G/s` : up >= 1 ? `${up.toFixed(2)}M/s` : `${(up * 1024).toFixed(2)}K/s`}
              </div>
            </div>
            <div className={"flex w-16 flex-col"}>
              <p className="text-xs text-muted-foreground">{t("serverCard.download")}</p>
              <div className="flex items-center text-xs font-semibold">
                {down >= 1024 ? `${(down / 1024).toFixed(2)}G/s` : down >= 1 ? `${down.toFixed(2)}M/s` : `${(down * 1024).toFixed(2)}K/s`}
              </div>
            </div>
            <div className={"flex w-20 flex-col"}>
              <p className="text-xs text-muted-foreground">{t("serverCard.totalUpload")}</p>
              <div className="flex items-center text-xs font-semibold">{formatBytes(net_out_transfer)}</div>
            </div>
            <div className={"flex w-20 flex-col"}>
              <p className="text-xs text-muted-foreground">{t("serverCard.totalDownload")}</p>
              <div className="flex items-center text-xs font-semibold">{formatBytes(net_in_transfer)}</div>
            </div>
          </section>
          
          {/* 服务器详细信息标签和 PlanInfo */}
          <section className="flex flex-col gap-1 w-full mt-1">
            {showServerDetails && (
              <>
                {/* 第一行：运行时间、CPU、内存、硬盘 */}
                <div className="flex items-center gap-1.5">
                  {uptime > 0 && (
                    <p className={cn("text-[10px] text-muted-foreground")}>
                      {t("serverCard.uptime")}: {formatUptime(uptime, t)}
                    </p>
                  )}
                  
                  {cpu_info && cpu_info.length > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className={cn("text-[10px] text-muted-foreground")}>
                            {cpu_info[0].includes("Physical") ? "物理CPU: " : "vCPU: "}
                            {cpu_info[0].match(/(\d+)\s+(?:Physical|Virtual)\s+Core/)?.[1] || "?"}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent className="text-xs">
                          {cpu_info.join(", ")}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  {mem_total > 0 && (
                    <p className={cn("text-[10px] text-muted-foreground")}>
                      {t("serverCard.mem")}: {formatBytes(mem_total)}
                    </p>
                  )}
                  
                  {disk_total > 0 && (
                    <p className={cn("text-[10px] text-muted-foreground")}>
                      {t("serverCard.stg")}: {formatBytes(disk_total)}
                    </p>
                  )}
                </div>

                {/* 第二行：TCP、UDP、进程数，以及 PlanInfo */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {tcp > 0 && (
                      <p className={cn("text-[10px] text-muted-foreground")}>
                        TCP: {tcp}
                      </p>
                    )}
                    
                    {udp > 0 && (
                      <p className={cn("text-[10px] text-muted-foreground")}>
                        UDP: {udp}
                      </p>
                    )}
                    
                    {process > 0 && (
                      <p className={cn("text-[10px] text-muted-foreground")}>
                        {t("serverDetailChart.process")}: {process}
                      </p>
                    )}
                  </div>
                  
                  {parsedData?.planDataMod && <PlanInfo parsedData={parsedData} />}
                </div>
              </>
            )}
          </section>
        </div>
      </Card>
    </section>
  ) : (
    <Card
      className={cn(
        "flex  min-h-[61px] min-w-[900px] items-center justify-start p-3 md:px-5 flex-row cursor-pointer hover:bg-accent/50 transition-colors",
        {
          "bg-card/70": customBackgroundImage,
        },
      )}
      onClick={cardClick}
    >
      <section className={cn("grid items-center gap-2 w-40")} style={{ gridTemplateColumns: "auto auto 1fr" }}>
        <span className="h-2 w-2 shrink-0 rounded-full bg-red-500 self-center"></span>
        <div className={cn("flex items-center justify-center", showFlag ? "min-w-[17px]" : "min-w-0")}>
          {showFlag ? <ServerFlag country_code={country_code} /> : null}
        </div>
        <div className="relative flex flex-col">
          <p className={cn("break-all font-bold w-28 tracking-tight", showFlag ? "text-xs" : "text-sm")}>{name}</p>
          {parsedData?.billingDataMod && <BillingInfo parsedData={parsedData} />}
        </div>
      </section>
      <Separator orientation="vertical" className="h-8 ml-3 lg:ml-1 mr-3" />
      {parsedData?.planDataMod && <PlanInfo parsedData={parsedData} />}
    </Card>
  )
}
