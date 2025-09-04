import GlobalMap from "@/components/GlobalMap"
import ServerCard from "@/components/ServerCard"
import ServerOverview from "@/components/ServerOverview"
import { ServiceTracker } from "@/components/ServiceTracker"
import { Loader } from "@/components/loading/Loader"
import { useStatus } from "@/hooks/use-status"
import { useWebSocketContext } from "@/hooks/use-websocket-context"
import { fetchServerGroup, fetchService } from "@/lib/nezha-api"
import { cn, formatNezhaInfo } from "@/lib/utils"
import { NezhaWebsocketResponse } from "@/types/nezha-api"
import { ServerGroup } from "@/types/nezha-api"
import { ChartBarSquareIcon, MapIcon } from "@heroicons/react/20/solid"
import { useQuery } from "@tanstack/react-query"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import DirectCountrySelect from "@/components/DirectCountrySelect"

export default function Servers() {
  const { t } = useTranslation()
  const { data: groupData } = useQuery({
    queryKey: ["server-group"],
    queryFn: () => fetchServerGroup(),
  })
  const { lastMessage, connected } = useWebSocketContext()
  const { status } = useStatus()
  const [showServices, setShowServices] = useState<string>("0")
  const [showMap, setShowMap] = useState<string>("0")
  const containerRef = useRef<HTMLDivElement>(null)
  
  // 使用ref存储筛选状态，防止WebSocket消息刷新时重置
  const groupRef = useRef<string>("All")
  const countryRef = useRef<string>("All")
  const [currentGroup, setCurrentGroup] = useState<string>("All")
  const [currentCountry, setCurrentCountry] = useState<string>("All")
  
  // 保存是否已经初始化了筛选状态
  const initializedRef = useRef<boolean>(false)


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

  // 简单按在线状态排序：在线的在前，离线的在后
  filteredServers = filteredServers.sort((a, b) => {
    const aOnline = formatNezhaInfo(nezhaWsData.now, a).online
    const bOnline = formatNezhaInfo(nezhaWsData.now, b).online
    
    if (aOnline && !bOnline) return -1
    if (!aOnline && bOnline) return 1
    return 0
  })

  return (
    <div className="mx-auto w-full max-w-5xl">
      <ServerOverview
        total={totalServers}
        online={onlineServers}
        offline={offlineServers}
        up={up}
        down={down}
        upSpeed={upSpeed}
        downSpeed={downSpeed}
      />
      <div className="flex mt-4 items-center gap-3">
        <button
          onClick={() => {
            setShowMap(showMap === "0" ? "1" : "0")
            localStorage.setItem("showMap", showMap === "0" ? "1" : "0")
          }}
          className={cn(
            "rounded-lg bg-card cursor-pointer p-2 transition-all hover:bg-muted border border-border",
            {
              "bg-primary text-primary-foreground": showMap === "1",
            }
          )}
        >
          <MapIcon className="size-4" />
        </button>
        <button
          onClick={() => {
            setShowServices(showServices === "0" ? "1" : "0")
            localStorage.setItem("showServices", showServices === "0" ? "1" : "0")
          }}
          className={cn(
            "rounded-lg bg-card cursor-pointer p-2 transition-all hover:bg-muted border border-border",
            {
              "bg-primary text-primary-foreground": showServices === "1",
            }
          )}
        >
          <ChartBarSquareIcon className="size-4" />
        </button>
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
      
      <section ref={containerRef} className="grid grid-cols-1 gap-6 mt-4 server-card-list">
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
