import ServerFlag from "@/components/ServerFlag"
import ServerUsageBar from "@/components/ServerUsageBar"
import { formatBytes } from "@/lib/format"
import { GetFontLogoClass, GetOsName, MageMicrosoftWindows } from "@/lib/logo-class"
import { cn, formatNezhaInfo, parsePublicNote } from "@/lib/utils"
import { CycleTransferData, NezhaServer } from "@/types/nezha-api"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import PlanInfo from "./PlanInfo"
import BillingInfo from "./billingInfo"
import { Card, CardContent, CardHeader, CardFooter } from "./ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { ArrowDown, ArrowUp, Clock, Cpu, HardDrive, Server, Activity, BarChart3 } from "lucide-react"

interface ServerCardProps {
  now: number;
  serverInfo: NezhaServer;
  cycleStats?: {
    [key: string]: CycleTransferData
  };
  groupName?: string;
}

export default function ServerCard({ now, serverInfo, cycleStats, groupName }: ServerCardProps) {
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
    uptime,
    arch,
    swap,
    swap_total
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

  const parsedData = parsePublicNote(public_note)

  // 获取匹配当前服务器的流量计费周期
  const getServerCycleData = () => {
    if (!cycleStats) {
      return null;
    }

    // 确保服务器ID的所有可能形式
    const serverId = String(serverInfo.id);
    const serverIdNum = Number(serverInfo.id);

    const matchedCycles: Array<{
      name: string;
      from: string;
      to: string;
      max: number;
      transfer: number;
      nextUpdate: string;
      progress: number;
    }> = []

    // 遍历所有流量周期，查找匹配当前服务器ID的数据
    Object.values(cycleStats).forEach((cycleData) => {

      if (!cycleData.server_name) {
        return;
      }

      const serverIdsInCycle = Object.keys(cycleData.server_name);

      // 检查各种可能的ID形式
      let matchedId = null;

      // 1. 直接匹配字符串ID
      if (serverIdsInCycle.includes(serverId)) {
        matchedId = serverId;
      }
      // 2. 尝试匹配数字ID (如果API返回的是数字ID)
      else if (serverIdsInCycle.includes(String(serverIdNum))) {
        matchedId = String(serverIdNum);
      }
      // 3. 通过名称匹配
      else {
        // 检查名称是否匹配
        const serverNames = Object.entries(cycleData.server_name);
        for (const [id, name] of serverNames) {
          if (name === serverInfo.name) {
            matchedId = id;
            break;
          }
        }

        // 如果还没匹配，尝试循环比较所有ID
        if (!matchedId) {
          for (const id of serverIdsInCycle) {
            if (Number(id) === serverIdNum) {
              matchedId = id;
              break;
            }
          }
        }
      }

      // 如果找到匹配的ID，且有对应的传输数据
      if (matchedId && cycleData.transfer && cycleData.transfer[matchedId] !== undefined) {
        const transfer = cycleData.transfer[matchedId];
        const progress = (transfer / cycleData.max) * 100;

        matchedCycles.push({
          name: cycleData.name,
          from: cycleData.from,
          to: cycleData.to,
          max: cycleData.max,
          transfer: transfer,
          nextUpdate: cycleData.next_update?.[matchedId] || "",
          progress: progress
        });
      }
    });

    return matchedCycles.length > 0 ? matchedCycles : null;
  }

  const serverCycleData = getServerCycleData()

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

  // 获取颜色等级
  const getColorClass = (value: number) => {
    if (value > 90) return "text-red-500"
    if (value > 70) return "text-orange-400"
    return "text-green-500"
  }

  // 根据进度获取状态颜色
  const getProgressColorClass = (value: number) => {
    if (value > 90) return "bg-red-500"
    if (value > 70) return "bg-orange-500"
    return "bg-emerald-500"
  }

  // 格式化大数值，超过1000显示为k格式
  const formatLargeNumber = (num: number) => {
    if (num >= 10000) {
      return `${Math.floor(num / 1000)}k+`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  if (!online) {
    return (
      <Card
        className={cn(
          "cursor-pointer hover:bg-accent/50 transition-all duration-300 border-red-300/30 dark:border-red-900/30 shadow-md hover:shadow-lg",
          { "bg-card/70": customBackgroundImage }
        )}
        onClick={cardClick}
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-red-500 rounded-l-md"></div>

        {/* 离线卡片的分组标签 */}
        {groupName && (
          <div className="absolute top-2 right-2">
            <div className="px-1.5 py-0.5 text-[10px] font-medium bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 rounded-sm border border-red-200 dark:border-red-800">
              {groupName}
            </div>
          </div>
        )}

        <CardContent className="p-4 pt-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="h-3 w-3 shrink-0 rounded-full bg-red-500 shadow-sm pulse-animation shadow-red-300 dark:shadow-red-900"></span>
            {showFlag && <ServerFlag country_code={country_code} />}
            <h3 className="font-bold text-sm truncate flex-1">{name}</h3>
          </div>

          <div className="flex justify-between items-start">
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
          </div>

          {/* 添加流量使用统计 */}
          {serverCycleData && serverCycleData.length > 0 && (
            <div className="mt-3">
              {serverCycleData.map((cycle, index) => (
                <div key={index} className="mt-3 bg-muted/30 rounded-md p-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <BarChart3 className="size-[12px] mr-1 text-emerald-500" />
                      <span className="text-xs font-medium">{cycle.name}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded">
                      {new Date(cycle.from).toLocaleDateString()} - {new Date(cycle.to).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs mt-1">
                    <div className="flex items-baseline gap-1">
                      <span className="font-medium text-xs">{formatBytes(cycle.transfer)}</span>
                      <span className="text-[10px] text-muted-foreground">/ {formatBytes(cycle.max)}</span>
                    </div>
                    <span className="text-[10px] font-medium">{cycle.progress.toFixed(1)}%</span>
                  </div>
                  <div className="relative h-1 mt-1">
                    <div className="absolute inset-0 bg-muted rounded-full" />
                    <div
                      className={cn("absolute inset-0 rounded-full transition-all duration-300", getProgressColorClass(cycle.progress))}
                      style={{ width: `${Math.min(cycle.progress, 100)}%` }}
                    />
                  </div>
                  {cycle.nextUpdate && (
                    <div className="mt-1 text-[10px] text-muted-foreground">
                      {t("cycleTransfer.nextUpdate")}: {new Date(cycle.nextUpdate).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        "cursor-pointer hover:bg-accent/50 transition-all duration-300 border-green-300/30 dark:border-green-900/30 shadow-md hover:shadow-lg relative overflow-hidden",
        { "bg-card/70": customBackgroundImage }
      )}
      onClick={cardClick}
    >
      {/* 左侧状态条 */}
      <div className="absolute top-0 left-0 w-1 h-full bg-green-500 rounded-l-md"></div>

      <CardHeader className="p-4 pb-2 pt-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 shrink-0 rounded-full bg-green-500 shadow-sm shadow-green-300 dark:shadow-green-900 animate-pulse"></span>
            {showFlag && <ServerFlag country_code={country_code} />}
            <h3 className="font-bold text-sm truncate">{name}</h3>
            {groupName && (
              <div className="px-1.5 py-0.5 text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 rounded-sm border border-green-200 dark:border-green-800">
                {groupName}
              </div>
            )}
          </div>

          <div className="flex items-center text-xs gap-2 text-muted-foreground">
            <div className="flex items-center">
              {platform.includes("Windows") ? (
                <MageMicrosoftWindows className="size-[14px] mr-1" />
              ) : (
                <span className={`fl-${GetFontLogoClass(platform)} mr-1`} />
              )}
              <span>{platform.includes("Windows") ? "Windows" : GetOsName(platform)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-start mt-2">
          {parsedData?.billingDataMod && (
            <div>
              <BillingInfo parsedData={parsedData} />
            </div>
          )}

          <div className="flex flex-col gap-1 items-end">
            {uptime > 0 && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="size-[12px] mr-1" />
                <span>{formatUptime(uptime, t)}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 pb-2">
        {/* 流量使用统计 */}
        {serverCycleData && serverCycleData.length > 0 && (
          <div className="mb-3 mt-2">
            {serverCycleData.map((cycle, index) => (
              <div key={index} className="bg-muted/40 rounded-lg p-2 mb-2 last:mb-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <BarChart3 className="size-[14px] mr-1 text-emerald-500" />
                    <span className="text-xs font-medium">{cycle.name}</span>
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-medium">
                    {cycle.progress.toFixed(1)}%
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs mb-1">
                  <div className="flex items-baseline gap-1">
                    <span className="font-medium">{formatBytes(cycle.transfer)}</span>
                    <span className="text-[10px] text-muted-foreground">/ {formatBytes(cycle.max)}</span>
                  </div>
                </div>

                <div className="relative h-1">
                  <div className="absolute inset-0 bg-muted rounded-full" />
                  <div
                    className={cn("absolute inset-0 rounded-full transition-all duration-300", getProgressColorClass(cycle.progress))}
                    style={{ width: `${Math.min(cycle.progress, 100)}%` }}
                  />
                </div>

                <div className="mt-1 text-[10px] text-muted-foreground flex justify-between">
                  <span>
                    {new Date(cycle.from).toLocaleDateString()} - {new Date(cycle.to).toLocaleDateString()}
                  </span>
                  {cycle.nextUpdate && (
                    <span>
                      {t("cycleTransfer.nextUpdate")}: {new Date(cycle.nextUpdate).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 主要资源使用情况 - 全新设计 */}
        <div className="grid grid-cols-3 gap-4 mt-3">
          {/* CPU使用率 */}
          <div className="bg-muted/40 rounded-lg p-2 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <Cpu className="size-[14px] mr-1 text-blue-500" />
                <span className="text-xs">CPU</span>
              </div>
              <span className={cn("text-xs font-bold", getColorClass(cpu))}>
                {cpu.toFixed(0)}%
              </span>
            </div>
            <ServerUsageBar value={cpu} />
            {/* CPU信息 */}
            {cpu_info && cpu_info.length > 0 && (
              <div className="mt-1.5 flex flex-col gap-1 text-[10px]">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded px-1.5 py-0.5 text-center">
                        {cpu_info[0].includes("Physical") ? "pCPU: " : "vCPU: "}
                        {cpu_info[0].match(/(\d+)\s+(?:Physical|Virtual)\s+Core/)?.[1] || "-"}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[250px] text-xs whitespace-pre-wrap p-2">
                      {cpu_info.join("\n")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {arch && (
                  <div className="bg-green-500/10 text-green-600 dark:text-green-400 rounded px-1.5 py-0.5 text-center">
                    {arch}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 内存使用率 */}
          <div className="bg-muted/40 rounded-lg p-2 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div className="size-[14px] mr-1 text-purple-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 16H8V8H16V16Z"></path>
                    <path d="M12 20V16"></path>
                    <path d="M12 8V4"></path>
                    <path d="M20 12H16"></path>
                    <path d="M8 12H4"></path>
                  </svg>
                </div>
                <span className="text-xs">{t("serverCard.mem")}</span>
              </div>
              <span className={cn("text-xs font-bold", getColorClass(mem))}>
                {mem.toFixed(0)}%
              </span>
            </div>
            <ServerUsageBar value={mem} />
            {/* 内存信息 */}
            <div className="mt-1.5 flex flex-col gap-1 text-[10px]">
              <div className="bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded px-1.5 py-0.5 text-center">
                {mem_total > 0 ? formatBytes(mem_total) : "-"}
              </div>
              {swap_total > 0 ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={cn("bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded px-1.5 py-0.5 text-center",
                        Number(swap) > 90 ? "bg-red-500/10 text-red-600 dark:text-red-400" :
                          Number(swap) > 70 ? "bg-orange-500/10 text-orange-600 dark:text-orange-400" : "")}>
                        SWAP:{swap.toFixed(0)}%
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">
                      <div className="flex flex-col gap-1 p-2">
                        <div className="flex justify-between items-center gap-3">
                          <span>总容量:</span>
                          <span>{formatBytes(swap_total)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-3">
                          <span>使用率:</span>
                          <span className={getColorClass(Number(swap))}>{swap.toFixed(1)}%</span>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded px-1.5 py-0.5 text-center">
                  -
                </div>
              )}
            </div>
          </div>

          {/* 存储使用率 */}
          <div className="bg-muted/40 rounded-lg p-2 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <HardDrive className="size-[14px] mr-1 text-amber-500" />
                <span className="text-xs">{t("serverCard.stg")}</span>
              </div>
              <span className={cn("text-xs font-bold", getColorClass(stg))}>
                {stg.toFixed(0)}%
              </span>
            </div>
            <ServerUsageBar value={stg} />
            {/* 存储信息 */}
            <div className="mt-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded px-1.5 py-0.5 text-center text-[10px]">
              {disk_total > 0 ? formatBytes(disk_total) : "-"}
            </div>
          </div>
        </div>

        {/* 网络使用情况 */}
        <div className="grid grid-cols-2 gap-4 mt-3">
          {/* 网络速率 */}
          <div className="bg-muted/40 rounded-lg p-2">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <ArrowUp className="size-[14px] text-blue-500 mr-1" />
                <span className="text-xs">{t("serverCard.upload")}</span>
              </div>
              <span className="text-xs font-medium">{formatSpeed(up)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center">
                <ArrowDown className="size-[14px] text-green-500 mr-1" />
                <span className="text-xs">{t("serverCard.download")}</span>
              </div>
              <span className="text-xs font-medium">{formatSpeed(down)}</span>
            </div>
          </div>

          {/* 连接数与进程数 */}
          <div className="bg-muted/40 rounded-lg p-2 grid grid-cols-2 gap-2">
            <div className="flex items-center min-w-0">
              <Server className="size-[14px] text-indigo-500 mr-1 flex-shrink-0" />
              <span className="text-xs truncate" title={`TCP连接: ${tcp}`}>T: {formatLargeNumber(tcp)}</span>
            </div>
            <div className="flex items-center min-w-0">
              <Server className="size-[14px] text-pink-500 mr-1 flex-shrink-0" />
              <span className="text-xs truncate" title={`UDP连接: ${udp}`}>U: {formatLargeNumber(udp)}</span>
            </div>
            <div className="flex items-center min-w-0 col-span-2">
              <Activity className="size-[14px] text-orange-500 mr-1 flex-shrink-0" />
              <span className="text-xs truncate" title={`进程数: ${process}`}>P: {formatLargeNumber(process)}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2 pb-3">
        {/* 套餐信息 */}
        {parsedData?.planDataMod && (
          <div className="w-full mt-2">
            <PlanInfo parsedData={parsedData} />
          </div>
        )}

        {/* 网络传输信息 */}
        {showNetTransfer && (
          <div className="grid grid-cols-2 w-full gap-3 mt-1">
            <div className="flex flex-col items-center bg-blue-500/10 rounded-md py-1.5 px-2">
              <div className="flex items-center text-[10px] text-blue-600 dark:text-blue-400">
                <ArrowUp className="size-[10px] mr-1" />
                <span>{t("serverCard.upload")}</span>
              </div>
              <span className="text-[11px] font-medium">{formatBytes(net_out_transfer)}</span>
            </div>
            <div className="flex flex-col items-center bg-green-500/10 rounded-md py-1.5 px-2">
              <div className="flex items-center text-[10px] text-green-600 dark:text-green-400">
                <ArrowDown className="size-[10px] mr-1" />
                <span>{t("serverCard.download")}</span>
              </div>
              <span className="text-[11px] font-medium">{formatBytes(net_in_transfer)}</span>
            </div>
          </div>
        )}
      </CardFooter>

      {/* 视觉元素：左侧状态条 */}
      <style>
        {`
        @keyframes pulse-animation {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        .pulse-animation {
          animation: pulse-animation 2s infinite;
        }
        `}
      </style>
    </Card>
  )
}
