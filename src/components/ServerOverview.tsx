import { useStatus } from "@/hooks/use-status"
import { formatBytes } from "@/lib/format"
import { cn } from "@/lib/utils"
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from "@heroicons/react/20/solid"

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
  const { status, setStatus } = useStatus()

  return (
    <div className="glass-panel rounded-xl p-3 mb-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* 服务器状态统计 */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => setStatus("all")}
            className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded px-2 py-1 transition-colors"
          >
            <div className="size-2 rounded-full bg-primary"></div>
            <span className="text-sm text-muted-foreground">总计</span>
            <span className="font-semibold">{total}</span>
          </div>
          
          <div 
            onClick={() => setStatus("online")}
            className={cn(
              "flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded px-2 py-1 transition-colors",
              { "bg-green-50 dark:bg-green-900/20": status === "online" }
            )}
          >
            <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-muted-foreground">在线</span>
            <span className="font-semibold text-green-600">{online}</span>
          </div>
          
          <div 
            onClick={() => setStatus("offline")}
            className={cn(
              "flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded px-2 py-1 transition-colors",
              { "bg-red-50 dark:bg-red-900/20": status === "offline" }
            )}
          >
            <div className="size-2 rounded-full bg-red-500"></div>
            <span className="text-sm text-muted-foreground">离线</span>
            <span className="font-semibold text-red-600">{offline}</span>
          </div>
        </div>

        {/* 网络流量统计 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm">
            <ArrowUpCircleIcon className="size-4 text-blue-600" />
            <span className="text-blue-600 font-medium">{formatBytes(upSpeed)}/s</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <ArrowDownCircleIcon className="size-4 text-purple-600" />
            <span className="text-purple-600 font-medium">{formatBytes(downSpeed)}/s</span>
          </div>
          <div className="text-xs text-muted-foreground">
            总流量: ↑{formatBytes(up)} ↓{formatBytes(down)}
          </div>
        </div>
      </div>
    </div>
  )
}
