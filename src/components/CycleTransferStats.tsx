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
        const serverStats = Object.entries(cycleData.server_name).map(
          ([serverId, serverName]) => ({
            serverId,
            serverName,
            transfer: cycleData.transfer[serverId] || 0,
            nextUpdate: cycleData.next_update[serverId],
          }),
        );

        return (
          <CycleTransferStatsClient
            key={cycleId}
            name={cycleData.name}
            from={cycleData.from}
            to={cycleData.to}
            max={cycleData.max}
            serverStats={serverStats}
            className={className}
          />
        );
      })}
    </section>
  );
};

export default CycleTransferStatsCard;
