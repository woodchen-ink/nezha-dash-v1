import ServerFlag from "@/components/ServerFlag"
import ServerUsageBar from "@/components/ServerUsageBar"
import { formatBytes } from "@/lib/format"
import { GetFontLogoClass, GetOsName, MageMicrosoftWindows } from "@/lib/logo-class"
import { cn, formatNezhaInfo, parsePublicNote } from "@/lib/utils"
import { NezhaServer } from "@/types/nezha-api"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import PlanInfo from "./PlanInfo"
import BillingInfo from "./billingInfo"
import { Badge } from "./ui/badge"
import { Card } from "./ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

export default function ServerCard({ now, serverInfo }: { now: number; serverInfo: NezhaServer }) {
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
    net_in_transfer, 
    net_out_transfer, 
    public_note, 
    platform,
    cpu_info,
    mem_total,
    disk_total,
    tcp,
    udp,
    process,
    uptime
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

  // @ts-expect-error ShowNetTransfer is a global variable
  const showNetTransfer = window.ShowNetTransfer as boolean

  // @ts-expect-error FixedTopServerName is a global variable
  const fixedTopServerName = window.FixedTopServerName as boolean

  // @ts-expect-error ShowServerDetails is a global variable
  const showServerDetails = window.ShowServerDetails !== undefined ? window.ShowServerDetails as boolean : true

  const parsedData = parsePublicNote(public_note)

  // 格式化运行时间
  const formatUptime = (seconds: number, t: any) => {
    if (seconds >= 86400) {
      return `${Math.floor(seconds / 86400)} ${t("serverCard.days")}`
    } else {
      return `${Math.floor(seconds / 3600)} ${t("serverCard.hours")}`
    }
  }

  return online ? (
    <Card
      className={cn(
        "flex flex-col items-center justify-start gap-4 p-4 md:px-6 cursor-pointer hover:bg-accent/50 transition-colors",
        {
          "flex-col": fixedTopServerName,
          "lg:flex-row": !fixedTopServerName,
        },
        {
          "bg-card/70": customBackgroundImage,
        },
      )}
      onClick={cardClick}
    >
      {/* 服务器名称和标识区域 */}
      <section
        className={cn("grid items-center gap-3", {
          "lg:w-44": !fixedTopServerName,
        })}
        style={{ gridTemplateColumns: "auto auto 1fr" }}
      >
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-green-500 shadow-sm shadow-green-300 dark:shadow-green-900"></span>
        <div className={cn("flex items-center justify-center", showFlag ? "min-w-[20px]" : "min-w-0")}>
          {showFlag ? <ServerFlag country_code={country_code} /> : null}
        </div>
        <div className="relative flex flex-col">
          <p className={cn("break-all font-bold tracking-tight", showFlag ? "text-sm" : "text-base")}>{name}</p>
          <div
            className={cn("hidden lg:block", {
              "lg:hidden": fixedTopServerName,
            })}
          >
            {parsedData?.billingDataMod && <BillingInfo parsedData={parsedData} />}
          </div>
        </div>
      </section>
      
      {/* 计费信息移动端展示 */}
      <div
        className={cn("flex items-center gap-2 -mt-2 lg:hidden", {
          "lg:flex": fixedTopServerName,
        })}
      >
        {parsedData?.billingDataMod && <BillingInfo parsedData={parsedData} />}
      </div>
      
      <div className="flex flex-col lg:items-start items-center gap-3 w-full">
        {/* 系统和资源使用情况 */}
        <section
          className={cn("grid grid-cols-5 items-center gap-4", {
            "lg:grid-cols-6 lg:gap-5": fixedTopServerName,
          })}
        >
          {fixedTopServerName && (
            <div className={"hidden col-span-1 items-center lg:flex lg:flex-row gap-2"}>
              <div className="text-xs font-semibold">
                {platform.includes("Windows") ? (
                  <MageMicrosoftWindows className="size-[12px]" />
                ) : (
                  <p className={`fl-${GetFontLogoClass(platform)}`} />
                )}
              </div>
              <div className={"flex w-16 flex-col"}>
                <p className="text-xs text-muted-foreground">{t("serverCard.system")}</p>
                <div className="flex items-center text-[11px] font-semibold">{platform.includes("Windows") ? "Windows" : GetOsName(platform)}</div>
              </div>
            </div>
          )}
          
          {/* CPU使用率 */}
          <div className={"flex w-16 flex-col"}>
            <p className="text-xs text-muted-foreground">{"CPU"}</p>
            <div className="flex items-center text-xs font-semibold">{cpu.toFixed(2)}%</div>
            <ServerUsageBar value={cpu} />
          </div>
          
          {/* 内存使用率 */}
          <div className={"flex w-16 flex-col"}>
            <p className="text-xs text-muted-foreground">{t("serverCard.mem")}</p>
            <div className="flex items-center text-xs font-semibold">{mem.toFixed(2)}%</div>
            <ServerUsageBar value={mem} />
          </div>
          
          {/* 存储使用率 */}
          <div className={"flex w-16 flex-col"}>
            <p className="text-xs text-muted-foreground">{t("serverCard.stg")}</p>
            <div className="flex items-center text-xs font-semibold">{stg.toFixed(2)}%</div>
            <ServerUsageBar value={stg} />
          </div>
          
          {/* 上传速度 */}
          <div className={"flex w-16 flex-col"}>
            <p className="text-xs text-muted-foreground">{t("serverCard.upload")}</p>
            <div className="flex items-center text-xs font-semibold">
              {up >= 1024 ? `${(up / 1024).toFixed(2)}G/s` : up >= 1 ? `${up.toFixed(2)}M/s` : `${(up * 1024).toFixed(2)}K/s`}
            </div>
          </div>
          
          {/* 下载速度 */}
          <div className={"flex w-16 flex-col"}>
            <p className="text-xs text-muted-foreground">{t("serverCard.download")}</p>
            <div className="flex items-center text-xs font-semibold">
              {down >= 1024 ? `${(down / 1024).toFixed(2)}G/s` : down >= 1 ? `${down.toFixed(2)}M/s` : `${(down * 1024).toFixed(2)}K/s`}
            </div>
          </div>
        </section>
        
        {/* 服务器详细信息区域 */}
        {showServerDetails && (
          <section className="flex flex-col gap-2 w-full mt-1 bg-muted/30 p-2 rounded-md">
            {/* 服务器配置信息 */}
            <div className="flex flex-wrap items-center gap-2">
              {/* 运行时间 */}
              {uptime > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-[10px] py-0 h-5">
                        {t("serverCard.uptime")}: {formatUptime(uptime, t)}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">
                      {t("serverCard.uptime")}: {formatUptime(uptime, t)}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {/* CPU信息 */}
              {cpu_info && cpu_info.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-[10px] py-0 h-5">
                        {cpu_info[0].includes("Physical") ? "pCPU: " : "vCPU: "}
                        {cpu_info[0].match(/(\d+)\s+(?:Physical|Virtual)\s+Core/)?.[1] || "?"}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">
                      {cpu_info.join(", ")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {/* 内存大小 */}
              {mem_total > 0 && (
                <Badge variant="outline" className="text-[10px] py-0 h-5">
                  {t("serverCard.mem")}: {formatBytes(mem_total)}
                </Badge>
              )}
              
              {/* 存储大小 */}
              {disk_total > 0 && (
                <Badge variant="outline" className="text-[10px] py-0 h-5">
                  {t("serverCard.stg")}: {formatBytes(disk_total)}
                </Badge>
              )}
              
              {/* TCP连接数 */}
              {tcp > 0 && (
                <Badge variant="outline" className="text-[10px] py-0 h-5">
                  TCP: {tcp}
                </Badge>
              )}
              
              {/* UDP连接数 */}
              {udp > 0 && (
                <Badge variant="outline" className="text-[10px] py-0 h-5">
                  UDP: {udp}
                </Badge>
              )}
              
              {/* 进程数 */}
              {process > 0 && (
                <Badge variant="outline" className="text-[10px] py-0 h-5">
                  {t("serverDetailChart.process")}: {process}
                </Badge>
              )}
            </div>
            
            {/* 套餐信息 */}
            {parsedData?.planDataMod && (
              <div className="flex justify-end">
                <PlanInfo parsedData={parsedData} />
              </div>
            )}
          </section>
        )}
        
        {/* 网络传输信息 */}
        {showNetTransfer && (
          <section className={"flex items-center w-full justify-between gap-2 mt-1"}>
            <Badge
              variant="secondary"
              className="items-center flex-1 justify-center rounded-[8px] text-[11px] border-muted-50 shadow-sm py-1.5"
            >
              {t("serverCard.upload")}: {formatBytes(net_out_transfer)}
            </Badge>
            <Badge
              variant="outline"
              className="items-center flex-1 justify-center rounded-[8px] text-[11px] shadow-sm py-1.5"
            >
              {t("serverCard.download")}: {formatBytes(net_in_transfer)}
            </Badge>
          </section>
        )}
      </div>
    </Card>
  ) : (
    <Card
      className={cn(
        "flex flex-col items-center justify-start gap-4 p-4 md:px-6 cursor-pointer hover:bg-accent/50 transition-colors",
        showNetTransfer ? "lg:min-h-[100px] min-h-[130px]" : "lg:min-h-[70px] min-h-[100px]",
        {
          "flex-col": fixedTopServerName,
          "lg:flex-row": !fixedTopServerName,
        },
        {
          "bg-card/70": customBackgroundImage,
        },
      )}
      onClick={cardClick}
    >
      <section
        className={cn("grid items-center gap-3", {
          "lg:w-44": !fixedTopServerName,
        })}
        style={{ gridTemplateColumns: "auto auto 1fr" }}
      >
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500 shadow-sm shadow-red-300 dark:shadow-red-900"></span>
        <div className={cn("flex items-center justify-center", showFlag ? "min-w-[20px]" : "min-w-0")}>
          {showFlag ? <ServerFlag country_code={country_code} /> : null}
        </div>
        <div className="relative flex flex-col">
          <p className={cn("break-all font-bold tracking-tight", showFlag ? "text-sm" : "text-base")}>{name}</p>
          <div
            className={cn("hidden lg:block", {
              "lg:hidden": fixedTopServerName,
            })}
          >
            {parsedData?.billingDataMod && <BillingInfo parsedData={parsedData} />}
          </div>
        </div>
      </section>
      <div
        className={cn("flex items-center gap-2 lg:hidden", {
          "lg:flex": fixedTopServerName,
        })}
      >
        {parsedData?.billingDataMod && <BillingInfo parsedData={parsedData} />}
      </div>
      {parsedData?.planDataMod && <PlanInfo parsedData={parsedData} />}
    </Card>
  )
}
