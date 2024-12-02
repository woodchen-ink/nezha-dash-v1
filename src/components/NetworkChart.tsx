"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { fetchMonitor } from "@/lib/nezha-api";
import { formatTime } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import NetworkChartLoading from "./NetworkChartLoading";
import { NezhaMonitor, ServerMonitorChart } from "@/types/nezha-api";

interface ResultItem {
  created_at: number;
  [key: string]: number | null;
}

export function NetworkChart({
  server_id,
  show,
}: {
  server_id: number;
  show: boolean;
}) {
  const { t } = useTranslation();

  const { data: monitorData } = useQuery({
    queryKey: ["monitor", server_id],
    queryFn: () => fetchMonitor(server_id),
    enabled: show,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 10000,
  });

  if (!monitorData) return <NetworkChartLoading />;

  if (monitorData?.success && !monitorData.data) {
    return (
      <>
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm font-medium opacity-40"></p>
          <p className="text-sm font-medium opacity-40 mb-4">
            {t("monitor.noData")}
          </p>
        </div>
        <NetworkChartLoading />
      </>
    );
  }

  const transformedData = transformData(monitorData.data);

  const formattedData = formatData(monitorData.data);

  const chartDataKey = Object.keys(transformedData);

  const initChartConfig = {
    avg_delay: {
      label: t("monitor.avgDelay"),
    },
    ...chartDataKey.reduce((acc, key) => {
      acc[key] = {
        label: key,
      };
      return acc;
    }, {} as ChartConfig),
  } satisfies ChartConfig;

  return (
    <NetworkChartClient
      chartDataKey={chartDataKey}
      chartConfig={initChartConfig}
      chartData={transformedData}
      serverName={monitorData.data[0].server_name}
      formattedData={formattedData}
    />
  );
}

export const NetworkChartClient = React.memo(function NetworkChart({
  chartDataKey,
  chartConfig,
  chartData,
  serverName,
  formattedData,
}: {
  chartDataKey: string[];
  chartConfig: ChartConfig;
  chartData: ServerMonitorChart;
  serverName: string;
  formattedData: ResultItem[];
}) {
  const { t } = useTranslation();

  const defaultChart = "All";

  const [activeCharts, setActiveCharts] = React.useState<string[]>([defaultChart]);

  const handleButtonClick = useCallback(
    (chart: string) => {
      setActiveCharts((prev) => {
        if (chart === defaultChart) {
          return [defaultChart];
        }
        
        const newCharts = prev.filter(c => c !== defaultChart);
        const chartIndex = newCharts.indexOf(chart);
        
        if (chartIndex === -1) {
          return newCharts.length === 0 ? [chart] : [...newCharts, chart];
        } else {
          const result = newCharts.filter(c => c !== chart);
          return result.length === 0 ? [defaultChart] : result;
        }
      });
    },
    [],
  );

  const getColorByIndex = useCallback(
    (chart: string) => {
      const index = chartDataKey.indexOf(chart);
      return `hsl(var(--chart-${(index % 10) + 1}))`;
    },
    [chartDataKey],
  );

  const chartButtons = useMemo(
    () =>
      chartDataKey.map((key) => (
        <button
          key={key}
          data-active={activeCharts.includes(key)}
          className={`relative z-30 flex cursor-pointer flex-1 flex-col justify-center gap-1 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-6`}
          onClick={() => handleButtonClick(key)}
        >
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            {key}
          </span>
          <span className="text-md font-bold leading-none sm:text-lg">
            {chartData[key][chartData[key].length - 1].avg_delay.toFixed(2)}ms
          </span>
        </button>
      )),
    [chartDataKey, activeCharts, chartData, handleButtonClick],
  );

  const chartLines = useMemo(() => {
    if (activeCharts.includes(defaultChart)) {
      return chartDataKey.map((key) => (
        <Line
          key={key}
          isAnimationActive={false}
          strokeWidth={1}
          type="linear"
          dot={false}
          dataKey={key}
          stroke={getColorByIndex(key)}
          connectNulls={true}
        />
      ));
    }
    
    return activeCharts.map((chart) => (
      <Line
        key={chart}
        isAnimationActive={false}
        strokeWidth={1}
        type="linear"
        dot={false}
        dataKey={chart}
        stroke={getColorByIndex(chart)}
        connectNulls={true}
      />
    ));
  }, [activeCharts, chartDataKey, getColorByIndex]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 p-0 sm:flex-row">
        <div className="flex flex-none flex-col justify-center gap-1 border-b px-6 py-4">
          <CardTitle className="flex flex-none items-center gap-0.5 text-md">
            {serverName}
          </CardTitle>
          <CardDescription className="text-xs">
            {chartDataKey.length} {t("monitor.monitorCount")}
          </CardDescription>
        </div>
        <div className="flex flex-wrap">{chartButtons}</div>
      </CardHeader>
      <CardContent className="pr-2 pl-0 py-4 sm:pt-6 sm:pb-6 sm:pr-6 sm:pl-2">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={
              activeCharts.includes(defaultChart)
                ? formattedData
                : chartData[activeCharts[0]]
            }
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="created_at"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              interval={"preserveStartEnd"}
              tickFormatter={(value) => formatRelativeTime(value)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={15}
              minTickGap={20}
              tickFormatter={(value) => `${value}ms`}
            />
            <ChartTooltip
              isAnimationActive={false}
              content={
                <ChartTooltipContent
                  indicator={"line"}
                  labelKey="created_at"
                  labelFormatter={(_, payload) => {
                    return formatTime(payload[0].payload.created_at);
                  }}
                />
              }
            />
            {activeCharts.includes(defaultChart) && (
              <ChartLegend content={<ChartLegendContent />} />
            )}
            {chartLines}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});

const transformData = (data: NezhaMonitor[]) => {
  const monitorData: ServerMonitorChart = {};

  data.forEach((item) => {
    const monitorName = item.monitor_name;

    if (!monitorData[monitorName]) {
      monitorData[monitorName] = [];
    }

    for (let i = 0; i < item.created_at.length; i++) {
      monitorData[monitorName].push({
        created_at: item.created_at[i],
        avg_delay: item.avg_delay[i],
      });
    }
  });

  return monitorData;
};

const formatData = (rawData: NezhaMonitor[]) => {
  const result: { [time: number]: ResultItem } = {};

  const allTimes = new Set<number>();
  rawData.forEach((item) => {
    item.created_at.forEach((time) => allTimes.add(time));
  });

  const allTimeArray = Array.from(allTimes).sort((a, b) => a - b);

  rawData.forEach((item) => {
    const { monitor_name, created_at, avg_delay } = item;

    allTimeArray.forEach((time) => {
      if (!result[time]) {
        result[time] = { created_at: time };
      }

      const timeIndex = created_at.indexOf(time);
      result[time][monitor_name] =
        timeIndex !== -1 ? avg_delay[timeIndex] : null;
    });
  });

  return Object.values(result).sort((a, b) => a.created_at - b.created_at);
};
