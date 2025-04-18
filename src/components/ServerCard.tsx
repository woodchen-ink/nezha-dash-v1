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
import { Card, CardContent, CardHeader, CardFooter } from "./ui/card"
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

  // 格式化网络速度
  const formatSpeed = (speed: number) => {
    return speed >= 1024 
      ? `${(speed / 1024).toFixed(2)}G/s` 
      : speed >= 1 
        ? `${speed.toFixed(2)}M/s` 
        : `${(speed * 1024).toFixed(2)}K/s`
  }

  if (!online) {
    return (
      <Card
        className={cn(
          "cursor-pointer hover:bg-accent/50 transition-colors border-red-300/30 dark:border-red-900/30",
          { "bg-card/70": customBackgroundImage }
        )}
        onClick={cardClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="h-3 w-3 shrink-0 rounded-full bg-red-500 shadow-sm shadow-red-300 dark:shadow-red-900"></span>
            {showFlag && <ServerFlag country_code={country_code} />}
            <h3 className="font-bold text-sm truncate flex-1">{name}</h3>
          </div>

          {parsedData?.billingDataMod && (
            <div className="mt-2">
              <BillingInfo parsedData={parsedData} />
            </div>
          )}
          
          {parsedData?.planDataMod && (
            <div className="mt-2">
              <PlanInfo parsedData={parsedData} />
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        "cursor-pointer hover:bg-accent/50 transition-colors border-green-300/30 dark:border-green-900/30",
        { "bg-card/70": customBackgroundImage }
      )}
      onClick={cardClick}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 shrink-0 rounded-full bg-green-500 shadow-sm shadow-green-300 dark:shadow-green-900"></span>
          {showFlag && <ServerFlag country_code={country_code} />}
          <h3 className="font-bold text-sm truncate flex-1">{name}</h3>
        </div>
        
        {parsedData?.billingDataMod && (
          <div className="mt-1">
            <BillingInfo parsedData={parsedData} />
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 pt-2 pb-2">
        {/* 系统信息和资源使用情况 */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-1">
          {/* 系统信息 */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="text-xs">
              {platform.includes("Windows") ? (
                <MageMicrosoftWindows className="size-[12px]" />
              ) : (
                <p className={`fl-${GetFontLogoClass(platform)}`} />
              )}
            </div>
            <span className="text-muted-foreground">
              {platform.includes("Windows") ? "Windows" : GetOsName(platform)}
            </span>
          </div>
          
          {/* 资源使用情况 */}
          <div className="col-span-5 grid grid-cols-5 gap-3">
            {/* CPU使用率 */}
            <div className="flex flex-col">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">CPU</span>
                <span className="font-medium">{cpu.toFixed(0)}%</span>
              </div>
              <ServerUsageBar value={cpu} />
            </div>
            
            {/* 内存使用率 */}
            <div className="flex flex-col">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{t("serverCard.mem")}</span>
                <span className="font-medium">{mem.toFixed(0)}%</span>
              </div>
              <ServerUsageBar value={mem} />
            </div>
            
            {/* 存储使用率 */}
            <div className="flex flex-col">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{t("serverCard.stg")}</span>
                <span className="font-medium">{stg.toFixed(0)}%</span>
              </div>
              <ServerUsageBar value={stg} />
            </div>
            
            {/* 网络上传 */}
            <div className="flex flex-col">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{t("serverCard.upload")}</span>
                <span className="font-medium">{formatSpeed(up)}</span>
              </div>
              <div className="h-[3px] bg-muted mt-1 rounded-sm overflow-hidden">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${Math.min(up * 10, 100)}%` }}
                />
              </div>
            </div>
            
            {/* 网络下载 */}
            <div className="flex flex-col">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{t("serverCard.download")}</span>
                <span className="font-medium">{formatSpeed(down)}</span>
              </div>
              <div className="h-[3px] bg-muted mt-1 rounded-sm overflow-hidden">
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${Math.min(down * 10, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* 服务器详细信息区域 */}
        {showServerDetails && (
          <div className="mt-3 flex flex-wrap gap-1.5">
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
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        {/* 套餐信息 */}
        {parsedData?.planDataMod && (
          <div className="w-full">
            <PlanInfo parsedData={parsedData} />
          </div>
        )}
        
        {/* 网络传输信息 */}
        {showNetTransfer && (
          <div className="grid grid-cols-2 w-full gap-2">
            <Badge
              variant="secondary"
              className="flex justify-center items-center py-1 text-[10px]"
            >
              {t("serverCard.upload")}: {formatBytes(net_out_transfer)}
            </Badge>
            <Badge
              variant="outline"
              className="flex justify-center items-center py-1 text-[10px]"
            >
              {t("serverCard.download")}: {formatBytes(net_in_transfer)}
            </Badge>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
