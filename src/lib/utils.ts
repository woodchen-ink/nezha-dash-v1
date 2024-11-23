import { NezhaAPI } from "@/types/nezha-api";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNezhaInfo(serverInfo: NezhaAPI) {
  const lastActiveTime = parseISOTimestamp(serverInfo.last_active);
  return {
    ...serverInfo,
    cpu: serverInfo.state.cpu || 0,
    process: serverInfo.state.process_count || 0,
    up: serverInfo.state.net_out_speed / 1024 / 1024 || 0,
    down: serverInfo.state.net_in_speed / 1024 / 1024 || 0,
    online: Date.now() - lastActiveTime <= 300000,
    uptime: serverInfo.state.uptime || 0,
    version: serverInfo.host.version || null,
    tcp: serverInfo.state.tcp_conn_count || 0,
    udp: serverInfo.state.udp_conn_count || 0,
    mem: (serverInfo.state.mem_used / serverInfo.host.mem_total) * 100 || 0,
    swap: (serverInfo.state.swap_used / serverInfo.host.swap_total) * 100 || 0,
    disk: (serverInfo.state.disk_used / serverInfo.host.disk_total) * 100 || 0,
    stg: (serverInfo.state.disk_used / serverInfo.host.disk_total) * 100 || 0,
    country_code: serverInfo.host.country_code,
  };
}

export function formatBytes(bytes: number, decimals: number = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function getDaysBetweenDates(date1: string, date2: string): number {
  const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);

  // 计算两个日期之间的天数差异
  return Math.round(
    Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay),
  );
}

export const fetcher = (url: string) =>
  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((data) => data.data)
    .catch((err) => {
      console.error(err);
      throw err;
    });

export const nezhaFetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // @ts-expect-error - res.json() returns a Promise<any>
    error.info = await res.json();
    // @ts-expect-error - res.status is a number
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export function parseISOTimestamp(isoString: string): number {
  return new Date(isoString).getTime();
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else if (seconds >= 0) {
    return `${seconds}s`;
  }
  return "0s";
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
