import React from "react";
import { CycleTransferStats } from "@/types/nezha-api";
import { CycleTransferStatsClient } from "./CycleTransferStatsClient";

interface CycleTransferStatsProps {
  cycleStats: CycleTransferStats;
  className?: string;
}

export const CycleTransferStatsCard: React.FC<CycleTransferStatsProps> = ({
  cycleStats,
  className,
}) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
      {Object.entries(cycleStats).map(([cycleId, cycleData]) => {
        if (!cycleData.server_name) {
          return null;
        }

        return Object.entries(cycleData.server_name).map(([serverId, serverName]) => {
          const transfer = cycleData.transfer?.[serverId] || 0;
          const nextUpdate = cycleData.next_update?.[serverId];

          if (!transfer && !nextUpdate) {
            return null;
          }

          return (
            <CycleTransferStatsClient
              key={`${cycleId}-${serverId}`}
              name={cycleData.name}
              from={cycleData.from}
              to={cycleData.to}
              max={cycleData.max}
              serverStats={[{
                serverId,
                serverName,
                transfer,
                nextUpdate: nextUpdate || "",
              }]}
              className={className}
            />
          );
        });
      })}
    </section>
  );
};

export default CycleTransferStatsCard;
