import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { formatNezhaInfo, formatRelativeTime } from "@/lib/utils";
import { NezhaAPI, NezhaAPIResponse } from "@/types/nezha-api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { ServerDetailChartLoading } from "./loading/ServerDetailLoading";
import AnimatedCircularProgressBar from "./ui/animated-circular-progress-bar";
import { useWebSocketContext } from "@/hooks/use-websocket-context";
import { useTranslation } from "react-i18next";

type cpuChartData = {
  timeStamp: string;
  cpu: number;
};

type processChartData = {
  timeStamp: string;
  process: number;
};

type diskChartData = {
  timeStamp: string;
  disk: number;
};

type memChartData = {
  timeStamp: string;
  mem: number;
  swap: number;
};

type networkChartData = {
  timeStamp: string;
  upload: number;
  download: number;
};

type connectChartData = {
  timeStamp: string;
  tcp: number;
  udp: number;
};

export default function ServerDetailChart() {
  const { id } = useParams();
  const { lastMessage, readyState } = useWebSocketContext();

  if (readyState !== 1) {
    return <ServerDetailChartLoading />;
  }

  const nezhaWsData = lastMessage
    ? (JSON.parse(lastMessage.data) as NezhaAPIResponse)
    : null;

  if (!nezhaWsData) {
    return <ServerDetailChartLoading />;
  }

  const server = nezhaWsData.servers.find((s) => s.id === Number(id));

  if (!server) {
    return <ServerDetailChartLoading />;
  }

  return (
    <section className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-3">
      <CpuChart data={server} />
      <ProcessChart data={server} />
      <DiskChart data={server} />
      <MemChart data={server} />
      <NetworkChart data={server} />
      <ConnectChart data={server} />
    </section>
  );
}

function CpuChart({ data }: { data: NezhaAPI }) {
  const [cpuChartData, setCpuChartData] = useState([] as cpuChartData[]);

  const { cpu } = formatNezhaInfo(data);

  useEffect(() => {
    if (data) {
      const timestamp = Date.now().toString();
      let newData = [] as cpuChartData[];
      if (cpuChartData.length === 0) {
        newData = [
          { timeStamp: timestamp, cpu: cpu },
          { timeStamp: timestamp, cpu: cpu },
        ];
      } else {
        newData = [...cpuChartData, { timeStamp: timestamp, cpu: cpu }];
      }
      if (newData.length > 30) {
        newData.shift();
      }
      setCpuChartData(newData);
    }
  }, [data]);

  const chartConfig = {
    cpu: {
      label: "CPU",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardContent className="px-6 py-3">
        <section className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-md font-medium">CPU</p>
            <section className="flex items-center gap-2">
              <p className="text-xs text-end w-10 font-medium">
                {cpu.toFixed(0)}%
              </p>
              <AnimatedCircularProgressBar
                className="size-3 text-[0px]"
                max={100}
                min={0}
                value={cpu}
                primaryColor="hsl(var(--chart-1))"
              />
            </section>
          </div>
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[130px] w-full"
          >
            <AreaChart
              accessibilityLayer
              data={cpuChartData}
              margin={{
                top: 12,
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timeStamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={200}
                interval="preserveStartEnd"
                tickFormatter={(value) => formatRelativeTime(value)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                mirror={true}
                tickMargin={-15}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Area
                isAnimationActive={false}
                dataKey="cpu"
                type="step"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.3}
                stroke="hsl(var(--chart-1))"
              />
            </AreaChart>
          </ChartContainer>
        </section>
      </CardContent>
    </Card>
  );
}

function ProcessChart({ data }: { data: NezhaAPI }) {
  const { t } = useTranslation();
  const [processChartData, setProcessChartData] = useState(
    [] as processChartData[],
  );

  const { process } = formatNezhaInfo(data);

  useEffect(() => {
    if (data) {
      const timestamp = Date.now().toString();
      let newData = [] as processChartData[];
      if (processChartData.length === 0) {
        newData = [
          { timeStamp: timestamp, process: process },
          { timeStamp: timestamp, process: process },
        ];
      } else {
        newData = [
          ...processChartData,
          { timeStamp: timestamp, process: process },
        ];
      }
      if (newData.length > 30) {
        newData.shift();
      }
      setProcessChartData(newData);
    }
  }, [data]);

  const chartConfig = {
    process: {
      label: "Process",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardContent className="px-6 py-3">
        <section className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-md font-medium">
              {t("serverDetailChart.process")}
            </p>
            <section className="flex items-center gap-2">
              <p className="text-xs text-end w-10 font-medium">{process}</p>
            </section>
          </div>
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[130px] w-full"
          >
            <AreaChart
              accessibilityLayer
              data={processChartData}
              margin={{
                top: 12,
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timeStamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={200}
                interval="preserveStartEnd"
                tickFormatter={(value) => formatRelativeTime(value)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                mirror={true}
                tickMargin={-15}
              />
              <Area
                isAnimationActive={false}
                dataKey="process"
                type="step"
                fill="hsl(var(--chart-2))"
                fillOpacity={0.3}
                stroke="hsl(var(--chart-2))"
              />
            </AreaChart>
          </ChartContainer>
        </section>
      </CardContent>
    </Card>
  );
}

function MemChart({ data }: { data: NezhaAPI }) {
  const { t } = useTranslation();
  const [memChartData, setMemChartData] = useState([] as memChartData[]);

  const { mem, swap } = formatNezhaInfo(data);

  useEffect(() => {
    if (data) {
      const timestamp = Date.now().toString();
      let newData = [] as memChartData[];
      if (memChartData.length === 0) {
        newData = [
          { timeStamp: timestamp, mem: mem, swap: swap },
          { timeStamp: timestamp, mem: mem, swap: swap },
        ];
      } else {
        newData = [
          ...memChartData,
          { timeStamp: timestamp, mem: mem, swap: swap },
        ];
      }
      if (newData.length > 30) {
        newData.shift();
      }
      setMemChartData(newData);
    }
  }, [data]);

  const chartConfig = {
    mem: {
      label: "Mem",
    },
    swap: {
      label: "Swap",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardContent className="px-6 py-3">
        <section className="flex flex-col gap-1">
          <div className="flex items-center">
            <section className="flex items-center gap-4">
              <div className="flex flex-col">
                <p className=" text-xs text-muted-foreground">
                  {t("serverDetailChart.mem")}
                </p>
                <div className="flex items-center gap-2">
                  <AnimatedCircularProgressBar
                    className="size-3 text-[0px]"
                    max={100}
                    min={0}
                    value={mem}
                    primaryColor="hsl(var(--chart-8))"
                  />
                  <p className="text-xs font-medium">{mem.toFixed(0)}%</p>
                </div>
              </div>
              <div className="flex flex-col">
                <p className=" text-xs text-muted-foreground">
                  {t("serverDetailChart.swap")}
                </p>
                <div className="flex items-center gap-2">
                  <AnimatedCircularProgressBar
                    className="size-3 text-[0px]"
                    max={100}
                    min={0}
                    value={swap}
                    primaryColor="hsl(var(--chart-10))"
                  />
                  <p className="text-xs font-medium">{swap.toFixed(0)}%</p>
                </div>
              </div>
            </section>
          </div>
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[130px] w-full"
          >
            <AreaChart
              accessibilityLayer
              data={memChartData}
              margin={{
                top: 12,
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timeStamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={200}
                interval="preserveStartEnd"
                tickFormatter={(value) => formatRelativeTime(value)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                mirror={true}
                tickMargin={-15}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Area
                isAnimationActive={false}
                dataKey="mem"
                type="step"
                fill="hsl(var(--chart-8))"
                fillOpacity={0.3}
                stroke="hsl(var(--chart-8))"
              />
              <Area
                isAnimationActive={false}
                dataKey="swap"
                type="step"
                fill="hsl(var(--chart-10))"
                fillOpacity={0.3}
                stroke="hsl(var(--chart-10))"
              />
            </AreaChart>
          </ChartContainer>
        </section>
      </CardContent>
    </Card>
  );
}

function DiskChart({ data }: { data: NezhaAPI }) {
  const { t } = useTranslation();
  const [diskChartData, setDiskChartData] = useState([] as diskChartData[]);

  const { disk } = formatNezhaInfo(data);

  useEffect(() => {
    if (data) {
      const timestamp = Date.now().toString();
      let newData = [] as diskChartData[];
      if (diskChartData.length === 0) {
        newData = [
          { timeStamp: timestamp, disk: disk },
          { timeStamp: timestamp, disk: disk },
        ];
      } else {
        newData = [...diskChartData, { timeStamp: timestamp, disk: disk }];
      }
      if (newData.length > 30) {
        newData.shift();
      }
      setDiskChartData(newData);
    }
  }, [data]);

  const chartConfig = {
    disk: {
      label: "Disk",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardContent className="px-6 py-3">
        <section className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-md font-medium">{t("serverDetailChart.disk")}</p>
            <section className="flex items-center gap-2">
              <p className="text-xs text-end w-10 font-medium">
                {disk.toFixed(0)}%
              </p>
              <AnimatedCircularProgressBar
                className="size-3 text-[0px]"
                max={100}
                min={0}
                value={disk}
                primaryColor="hsl(var(--chart-5))"
              />
            </section>
          </div>
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[130px] w-full"
          >
            <AreaChart
              accessibilityLayer
              data={diskChartData}
              margin={{
                top: 12,
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timeStamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={200}
                interval="preserveStartEnd"
                tickFormatter={(value) => formatRelativeTime(value)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                mirror={true}
                tickMargin={-15}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Area
                isAnimationActive={false}
                dataKey="disk"
                type="step"
                fill="hsl(var(--chart-5))"
                fillOpacity={0.3}
                stroke="hsl(var(--chart-5))"
              />
            </AreaChart>
          </ChartContainer>
        </section>
      </CardContent>
    </Card>
  );
}

function NetworkChart({ data }: { data: NezhaAPI }) {
  const { t } = useTranslation();
  const [networkChartData, setNetworkChartData] = useState(
    [] as networkChartData[],
  );

  const { up, down } = formatNezhaInfo(data);

  useEffect(() => {
    if (data) {
      const timestamp = Date.now().toString();
      let newData = [] as networkChartData[];
      if (networkChartData.length === 0) {
        newData = [
          { timeStamp: timestamp, upload: up, download: down },
          { timeStamp: timestamp, upload: up, download: down },
        ];
      } else {
        newData = [
          ...networkChartData,
          { timeStamp: timestamp, upload: up, download: down },
        ];
      }
      if (newData.length > 30) {
        newData.shift();
      }
      setNetworkChartData(newData);
    }
  }, [data]);

  let maxDownload = Math.max(...networkChartData.map((item) => item.download));
  maxDownload = Math.ceil(maxDownload);
  if (maxDownload < 1) {
    maxDownload = 1;
  }

  const chartConfig = {
    upload: {
      label: "Upload",
    },
    download: {
      label: "Download",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardContent className="px-6 py-3">
        <section className="flex flex-col gap-1">
          <div className="flex items-center">
            <section className="flex items-center gap-4">
              <div className="flex flex-col w-20">
                <p className="text-xs text-muted-foreground">
                  {t("serverDetailChart.upload")}
                </p>
                <div className="flex items-center gap-1">
                  <span className="relative inline-flex  size-1.5 rounded-full bg-[hsl(var(--chart-1))]"></span>
                  <p className="text-xs font-medium">{up.toFixed(2)} M/s</p>
                </div>
              </div>
              <div className="flex flex-col w-20">
                <p className=" text-xs text-muted-foreground">
                  {t("serverDetailChart.download")}
                </p>
                <div className="flex items-center gap-1">
                  <span className="relative inline-flex  size-1.5 rounded-full bg-[hsl(var(--chart-4))]"></span>
                  <p className="text-xs font-medium">{down.toFixed(2)} M/s</p>
                </div>
              </div>
            </section>
          </div>
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[130px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={networkChartData}
              margin={{
                top: 12,
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timeStamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={200}
                interval="preserveStartEnd"
                tickFormatter={(value) => formatRelativeTime(value)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                mirror={true}
                tickMargin={-15}
                type="number"
                minTickGap={50}
                interval="preserveStartEnd"
                domain={[1, maxDownload]}
                tickFormatter={(value) => `${value.toFixed(0)}M/s`}
              />
              <Line
                isAnimationActive={false}
                dataKey="upload"
                type="linear"
                stroke="hsl(var(--chart-1))"
                strokeWidth={1}
                dot={false}
              />
              <Line
                isAnimationActive={false}
                dataKey="download"
                type="linear"
                stroke="hsl(var(--chart-4))"
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </section>
      </CardContent>
    </Card>
  );
}

function ConnectChart({ data }: { data: NezhaAPI }) {
  const [connectChartData, setConnectChartData] = useState(
    [] as connectChartData[],
  );

  const { tcp, udp } = formatNezhaInfo(data);

  useEffect(() => {
    if (data) {
      const timestamp = Date.now().toString();
      let newData = [] as connectChartData[];
      if (connectChartData.length === 0) {
        newData = [
          { timeStamp: timestamp, tcp: tcp, udp: udp },
          { timeStamp: timestamp, tcp: tcp, udp: udp },
        ];
      } else {
        newData = [
          ...connectChartData,
          { timeStamp: timestamp, tcp: tcp, udp: udp },
        ];
      }
      if (newData.length > 30) {
        newData.shift();
      }
      setConnectChartData(newData);
    }
  }, [data]);

  const chartConfig = {
    tcp: {
      label: "TCP",
    },
    udp: {
      label: "UDP",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardContent className="px-6 py-3">
        <section className="flex flex-col gap-1">
          <div className="flex items-center">
            <section className="flex items-center gap-4">
              <div className="flex flex-col w-12">
                <p className="text-xs text-muted-foreground">TCP</p>
                <div className="flex items-center gap-1">
                  <span className="relative inline-flex  size-1.5 rounded-full bg-[hsl(var(--chart-1))]"></span>
                  <p className="text-xs font-medium">{tcp}</p>
                </div>
              </div>
              <div className="flex flex-col w-12">
                <p className=" text-xs text-muted-foreground">UDP</p>
                <div className="flex items-center gap-1">
                  <span className="relative inline-flex  size-1.5 rounded-full bg-[hsl(var(--chart-4))]"></span>
                  <p className="text-xs font-medium">{udp}</p>
                </div>
              </div>
            </section>
          </div>
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[130px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={connectChartData}
              margin={{
                top: 12,
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timeStamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={200}
                interval="preserveStartEnd"
                tickFormatter={(value) => formatRelativeTime(value)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                mirror={true}
                tickMargin={-15}
                type="number"
                interval="preserveStartEnd"
              />
              <Line
                isAnimationActive={false}
                dataKey="tcp"
                type="linear"
                stroke="hsl(var(--chart-1))"
                strokeWidth={1}
                dot={false}
              />
              <Line
                isAnimationActive={false}
                dataKey="udp"
                type="linear"
                stroke="hsl(var(--chart-4))"
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </section>
      </CardContent>
    </Card>
  );
}
