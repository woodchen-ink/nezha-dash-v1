import React from "react";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/format";

interface CycleTransferStatsClientProps {
  name: string;
  from: string;
  to: string;
  max: number;
  serverStats: Array<{
    serverId: string;
    serverName: string;
    transfer: number;
    nextUpdate: string;
  }>;
  className?: string;
}

export const CycleTransferStatsClient: React.FC<
  CycleTransferStatsClientProps
> = ({ name, from, to, max, serverStats, className }) => {
  return (
    <div
      className={cn(
        "w-full space-y-2 bg-white px-4 py-3 dark:bg-black rounded-lg border bg-card text-card-foreground shadow-lg shadow-neutral-200/40 dark:shadow-none",
        className,
      )}
    >
      <div className="space-y-1">
        {/* <div className="flex justify-between items-center">
          <span className=" font-semibold text-sm">{name}</span>
          <span className="text-stone-600 dark:text-stone-400 text-xs">
            {new Date(from).toLocaleDateString()} -{" "}
            {new Date(to).toLocaleDateString()}
          </span>
        </div> */}
        <div className="space-y-2">
          {serverStats.map(({ serverId, serverName, transfer, nextUpdate }) => {
            const progress = (transfer / max) * 100;

            return (
              <div key={serverId} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">{serverName}</span>
                  <span className="text-sm text-stone-600 dark:text-stone-400 font-semibold">
                    {formatBytes(transfer)} / {formatBytes(max)}
                  </span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                <section className="flex justify-between items-center">
                  <div className="text-xs text-stone-500 dark:text-stone-400">
                    Next update: {new Date(nextUpdate).toLocaleString()}
                  </div>
                  <section className="flex items-center gap-2">
                    <span className="text-stone-600 dark:text-stone-400 text-xs">
                      {new Date(from).toLocaleDateString()} -{" "}
                      {new Date(to).toLocaleDateString()}
                    </span>
                    <div className=" bg-blue-600 text-white px-1 py-0.5 rounded text-[10px]">
                      {name}
                    </div>
                  </section>
                </section>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CycleTransferStatsClient;
