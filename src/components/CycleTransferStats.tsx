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
    <>
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
    </>
  );
};

export default CycleTransferStatsCard;
