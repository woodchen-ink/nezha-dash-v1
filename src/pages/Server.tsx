import GlobalMap from "@/components/GlobalMap"
import ServerCard from "@/components/ServerCard"
import ServerOverview from "@/components/ServerOverview"
import { ServiceTracker } from "@/components/ServiceTracker"
import { Loader } from "@/components/loading/Loader"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SORT_ORDERS, SORT_TYPES } from "@/context/sort-context"
import { useSort } from "@/hooks/use-sort"
import { useStatus } from "@/hooks/use-status"
import { useWebSocketContext } from "@/hooks/use-websocket-context"
import { fetchServerGroup, fetchService } from "@/lib/nezha-api"
import { cn, formatNezhaInfo } from "@/lib/utils"
import { NezhaWebsocketResponse } from "@/types/nezha-api"
import { ServerGroup } from "@/types/nezha-api"
import { ArrowDownIcon, ArrowUpIcon, ArrowsUpDownIcon, ChartBarSquareIcon, MapIcon } from "@heroicons/react/20/solid"
import { useQuery } from "@tanstack/react-query"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import DirectCountrySelect from "@/components/DirectCountrySelect"

export default function Servers() {
  const { t } = useTranslation()
  const { sortType, sortOrder, setSortOrder, setSortType } = useSort()
  const { data: groupData } = useQuery({
    queryKey: ["server-group"],
    queryFn: () => fetchServerGroup(),
  })
  const { lastMessage, connected } = useWebSocketContext()
  const { status } = useStatus()
  const [showServices, setShowServices] = useState<string>("0")
  const [showMap, setShowMap] = useState<string>("0")
  const containerRef = useRef<HTMLDivElement>(null)
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false)
  
  // 使用ref存储筛选状态，防止WebSocket消息刷新时重置
  const groupRef = useRef<string>("All")
  const countryRef = useRef<string>("All")
  const [currentGroup, setCurrentGroup] = useState<string>("All")
  const [currentCountry, setCurrentCountry] = useState<string>("All")
  
  // 保存是否已经初始化了筛选状态
  const initializedRef = useRef<boolean>(false)

  const customBackgroundImage = (window.CustomBackgroundImage as string) !== "" ? window.CustomBackgroundImage : undefined

  const restoreScrollPosition = () => {
    const savedPosition = sessionStorage.getItem("scrollPosition")
    if (savedPosition && containerRef.current) {
      containerRef.current.scrollTop = Number(savedPosition)
    }
  }

  const handleCountryChange = useCallback((newCountry: string) => {
    countryRef.current = newCountry;
    
    // 强制立即更新状态
    setCurrentCountry(newCountry);
    
    // 保存到会话存储
    sessionStorage.setItem("selectedCountry", newCountry);
    sessionStorage.setItem("scrollPosition", String(containerRef.current?.scrollTop || 0));
  }, []);

  useEffect(() => {
    const showServicesState = localStorage.getItem("showServices")
    if (window.ForceShowServices) {
      setShowServices("1")
    } else if (showServicesState !== null) {
      setShowServices(showServicesState)
    } else {
      localStorage.setItem("showServices", "0")
      setShowServices("0")
    }
  }, [])

  useEffect(() => {
    const showMapState = localStorage.getItem("showMap")
    if (window.ForceShowMap) {
      setShowMap("1")
    } else if (showMapState !== null) {
      setShowMap(showMapState)
    }
  }, [])

  // 仅在组件挂载时初始化一次状态
  useEffect(() => {
    if (initializedRef.current) return;
    
    const savedGroup = sessionStorage.getItem("selectedGroup") || "All"
    const savedCountry = sessionStorage.getItem("selectedCountry") || "All"
    
    groupRef.current = savedGroup
    countryRef.current = savedCountry
    
    setCurrentGroup(savedGroup)
    setCurrentCountry(savedCountry)
    
    restoreScrollPosition()
    
    // 如果没有保存值，初始化存储
    if (!sessionStorage.getItem("selectedGroup")) {
      sessionStorage.setItem("selectedGroup", "All")
    }
    
    if (!sessionStorage.getItem("selectedCountry")) {
      sessionStorage.setItem("selectedCountry", "All")
    }
    
    initializedRef.current = true
  }, [])

  // 当WebSocket消息更新时，确保UI状态与ref同步
  useEffect(() => {
    if (!lastMessage || !initializedRef.current) return;
    
    // 保持用户选择的筛选状态
    setCurrentGroup(groupRef.current)
    setCurrentCountry(countryRef.current)
  }, [lastMessage])

  const nezhaWsData = lastMessage ? (JSON.parse(lastMessage.data) as NezhaWebsocketResponse) : null

  // 获取所有可用的国家代码
  const availableCountries = nezhaWsData?.servers 
    ? [...new Set(nezhaWsData.servers.map(server => server.country_code?.toLowerCase()))]
      .filter(Boolean)
      .sort()
    : []

  const countryTabs = [
    "All",
    ...availableCountries.map(code => code.toUpperCase())
  ]

  // 获取cycle_transfer_stats数据
  const { data: serviceData } = useQuery({
    queryKey: ["service"],
    queryFn: () => fetchService(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 10000,
  })

  const cycleTransferStats = serviceData?.data?.cycle_transfer_stats
  

  if (!connected && !lastMessage) {
    return (
      <div className="flex flex-col items-center min-h-96 justify-center ">
        <div className="font-semibold flex items-center gap-2 text-sm">
          <Loader visible={true} />
          {t("info.websocketConnecting")}
        </div>
      </div>
    )
  }

  if (!nezhaWsData) {
    return (
      <div className="flex flex-col items-center justify-center ">
        <p className="font-semibold text-sm">{t("info.processing")}</p>
      </div>
    )
  }

  let filteredServers =
    nezhaWsData?.servers?.filter((server) => {
      // 组筛选
      if (currentGroup !== "All") {
        const group = groupData?.data?.find(
          (g: ServerGroup) => g.group.name === currentGroup && Array.isArray(g.servers) && g.servers.includes(server.id),
        )
        if (!group) {
          return false
        }
      }
      
      // 国家筛选
      if (currentCountry !== "All") {
        const serverCountry = server.country_code?.toUpperCase()
        if (serverCountry !== currentCountry) {
          return false
        }
      }
      
      return true
    }) || []

  const totalServers = filteredServers.length || 0
  const onlineServers = filteredServers.filter((server) => formatNezhaInfo(nezhaWsData.now, server).online)?.length || 0
  const offlineServers = filteredServers.filter((server) => !formatNezhaInfo(nezhaWsData.now, server).online)?.length || 0
  const up =
    filteredServers.reduce(
      (total, server) => (formatNezhaInfo(nezhaWsData.now, server).online ? total + (server.state?.net_out_transfer ?? 0) : total),
      0,
    ) || 0
  const down =
    filteredServers.reduce(
      (total, server) => (formatNezhaInfo(nezhaWsData.now, server).online ? total + (server.state?.net_in_transfer ?? 0) : total),
      0,
    ) || 0

  const upSpeed =
    filteredServers.reduce(
      (total, server) => (formatNezhaInfo(nezhaWsData.now, server).online ? total + (server.state?.net_out_speed ?? 0) : total),
      0,
    ) || 0
  const downSpeed =
    filteredServers.reduce(
      (total, server) => (formatNezhaInfo(nezhaWsData.now, server).online ? total + (server.state?.net_in_speed ?? 0) : total),
      0,
    ) || 0

  filteredServers =
    status === "all"
      ? filteredServers
      : filteredServers.filter((server) => [status].includes(formatNezhaInfo(nezhaWsData.now, server).online ? "online" : "offline"))

  filteredServers = filteredServers.sort((a, b) => {
    const serverAInfo = formatNezhaInfo(nezhaWsData.now, a)
    const serverBInfo = formatNezhaInfo(nezhaWsData.now, b)

    if (sortType !== "name") {
      // 仅在非 "name" 排序时，先按在线状态排序
      if (!serverAInfo.online && serverBInfo.online) return 1
      if (serverAInfo.online && !serverBInfo.online) return -1
      if (!serverAInfo.online && !serverBInfo.online) {
        // 如果两者都离线，可以继续按照其他条件排序，或者保持原序
        // 这里选择保持原序
        return 0
      }
    }

    let comparison = 0

    switch (sortType) {
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "uptime":
        comparison = (a.state?.uptime ?? 0) - (b.state?.uptime ?? 0)
        break
      case "system":
        comparison = a.host.platform.localeCompare(b.host.platform)
        break
      case "cpu":
        comparison = (a.state?.cpu ?? 0) - (b.state?.cpu ?? 0)
        break
      case "mem":
        comparison = (formatNezhaInfo(nezhaWsData.now, a).mem ?? 0) - (formatNezhaInfo(nezhaWsData.now, b).mem ?? 0)
        break
      case "disk":
        comparison = (formatNezhaInfo(nezhaWsData.now, a).disk ?? 0) - (formatNezhaInfo(nezhaWsData.now, b).disk ?? 0)
        break
      case "up":
        comparison = (a.state?.net_out_speed ?? 0) - (b.state?.net_out_speed ?? 0)
        break
      case "down":
        comparison = (a.state?.net_in_speed ?? 0) - (b.state?.net_in_speed ?? 0)
        break
      case "up total":
        comparison = (a.state?.net_out_transfer ?? 0) - (b.state?.net_out_transfer ?? 0)
        break
      case "down total":
        comparison = (a.state?.net_in_transfer ?? 0) - (b.state?.net_in_transfer ?? 0)
        break
      default:
        comparison = 0
    }

    return sortOrder === "asc" ? comparison : -comparison
  })

  return (
    <div className="mx-auto w-full max-w-[1600px] px-0">
      <ServerOverview
        total={totalServers}
        online={onlineServers}
        offline={offlineServers}
        up={up}
        down={down}
        upSpeed={upSpeed}
        downSpeed={downSpeed}
      />
      <div className="flex mt-4 items-center justify-between gap-2 server-overview-controls">
        <section className="flex items-center gap-2 w-full overflow-hidden">
          <button
            onClick={() => {
              setShowMap(showMap === "0" ? "1" : "0")
              localStorage.setItem("showMap", showMap === "0" ? "1" : "0")
            }}
            className={cn(
              "rounded-[50px] bg-white dark:bg-stone-800 cursor-pointer p-[10px] transition-all border dark:border-none border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]",
              {
                "shadow-[inset_0_1px_0_rgba(0,0,0,0.2)] !bg-blue-600 hover:!bg-blue-600 border-blue-600 dark:border-blue-600": showMap === "1",
                "text-white": showMap === "1",
              },
              {
                "bg-opacity-70 dark:bg-opacity-70": customBackgroundImage,
              },
            )}
          >
            <MapIcon
              className={cn("size-[13px]", {
                "text-white": showMap === "1",
              })}
            />
          </button>
          <button
            onClick={() => {
              setShowServices(showServices === "0" ? "1" : "0")
              localStorage.setItem("showServices", showServices === "0" ? "1" : "0")
            }}
            className={cn(
              "rounded-[50px] bg-white dark:bg-stone-800 cursor-pointer p-[10px] transition-all border dark:border-none border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]",
              {
                "shadow-[inset_0_1px_0_rgba(0,0,0,0.2)] !bg-blue-600 hover:!bg-blue-600 border-blue-600 dark:border-blue-600": showServices === "1",
                "text-white": showServices === "1",
              },
              {
                "bg-opacity-70 dark:bg-opacity-70": customBackgroundImage,
              },
            )}
          >
            <ChartBarSquareIcon
              className={cn("size-[13px]", {
                "text-white": showServices === "1",
              })}
            />
          </button>
        </section>
        <Popover onOpenChange={setSettingsOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "rounded-[50px] flex items-center gap-1 dark:text-white border dark:border-none text-black cursor-pointer dark:[text-shadow:_0_1px_0_rgb(0_0_0_/_20%)] dark:bg-stone-800 bg-white  p-[10px] transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]  ",
                {
                  "shadow-[inset_0_1px_0_rgba(0,0,0,0.2)] dark:bg-stone-700 bg-stone-200": settingsOpen,
                },
                {
                  "dark:bg-stone-800/70 bg-stone-100/70 ": customBackgroundImage,
                },
              )}
            >
              <p className="text-[10px] font-bold whitespace-nowrap">{sortType === "default" ? "Sort" : sortType.toUpperCase()}</p>
              {sortOrder === "asc" && sortType !== "default" ? (
                <ArrowUpIcon className="size-[13px]" />
              ) : sortOrder === "desc" && sortType !== "default" ? (
                <ArrowDownIcon className="size-[13px]" />
              ) : (
                <ArrowsUpDownIcon className="size-[13px]" />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="p-4 w-[240px] rounded-lg">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Sort by</Label>
                <Select value={sortType} onValueChange={setSortType}>
                  <SelectTrigger className="w-full text-xs h-8">
                    <SelectValue placeholder="Choose type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_TYPES.map((type) => (
                      <SelectItem key={type} value={type} className="text-xs">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Sort order</Label>
                <Select value={sortOrder} onValueChange={setSortOrder} disabled={sortType === "default"}>
                  <SelectTrigger className="w-full text-xs h-8">
                    <SelectValue placeholder="Choose order" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_ORDERS.map((order) => (
                      <SelectItem key={order} value={order} className="text-xs">
                        {order.charAt(0).toUpperCase() + order.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {showMap === "1" && <GlobalMap now={nezhaWsData.now} serverList={nezhaWsData?.servers || []} />}
      {showServices === "1" && <ServiceTracker serverList={filteredServers} />}
      
      {/* 优化直接国家选择器 */}
      <div className="mt-3">
        <DirectCountrySelect 
          countries={countryTabs.filter(tab => tab !== "All")}
          currentCountry={currentCountry}
          onChange={handleCountryChange}
        />
      </div>
      
      <section ref={containerRef} className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-4 server-card-list">
        {filteredServers.map((serverInfo) => {
          // 查找服务器所属的分组
          const serverGroup = groupData?.data?.find(
            (g: ServerGroup) => Array.isArray(g.servers) && g.servers.includes(serverInfo.id)
          );
          
          return (
            <ServerCard 
              now={nezhaWsData.now} 
              key={serverInfo.id} 
              serverInfo={serverInfo} 
              cycleStats={cycleTransferStats}
              groupName={serverGroup?.group.name}
            />
          );
        })}
      </section>
    </div>
  )
}
