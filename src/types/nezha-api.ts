export interface NezhaAPIResponse {
  now: number;
  servers: NezhaAPI[];
}

export interface NezhaAPI {
  id: number;
  name: string;
  last_active: string;
  host: NezhaAPIHost;
  state: NezhaAPIStatus;
}

export interface NezhaAPIHost {
  platform: string;
  platform_version: string;
  cpu: string[];
  mem_total: number;
  disk_total: number;
  swap_total: number;
  arch: string;
  boot_time: number;
  country_code: string;
  version: string;
}

export interface NezhaAPIStatus {
  cpu: number;
  mem_used: number;
  swap_used: number;
  disk_used: number;
  net_in_transfer: number;
  net_out_transfer: number;
  net_in_speed: number;
  net_out_speed: number;
  uptime: number;
  load_1: number;
  load_5: number;
  load_15: number;
  tcp_conn_count: number;
  udp_conn_count: number;
  process_count: number;
  temperatures: number;
  gpu: number;
}

export interface ServerGroupResponse {
  success: boolean;
  data: ServerGroup[];
}

export interface ServerGroup {
  group: {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
  };
  servers: number[];
}

export interface LoginUserResponse {
  success: boolean;
  data: {
    id: number;
    username: string;
    password: string;
    created_at: string;
    updated_at: string;
  };
}
