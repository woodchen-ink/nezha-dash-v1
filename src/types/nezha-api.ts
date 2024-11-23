export interface NezhaAPI {
  id: number;
  name: string;
  host: NezhaAPIHost;
  status: NezhaAPIStatus;
}

export interface NezhaAPIHost {
  Platform: string;
  PlatformVersion: string;
  CPU: string[];
  MemTotal: number;
  DiskTotal: number;
  SwapTotal: number;
  Arch: string;
  BootTime: number;
  CountryCode: string;
  Version: string;
}

export interface NezhaAPIStatus {
  CPU: number;
  MemUsed: number;
  SwapUsed: number;
  DiskUsed: number;
  NetInTransfer: number;
  NetOutTransfer: number;
  NetInSpeed: number;
  NetOutSpeed: number;
  Uptime: number;
  Load1: number;
  Load5: number;
  Load15: number;
  TcpConnCount: number;
  UdpConnCount: number;
  ProcessCount: number;
  Temperatures: number;
  GPU: number;
}
