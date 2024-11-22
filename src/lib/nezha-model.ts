/**
 * model.Server
 */
export interface ModelServer {
  created_at: string;
  /**
   * DDNS配置
   */
  ddns_profiles: number[];
  deleted_at: string;
  /**
   * 展示排序，越大越靠前
   */
  display_index: number;
  /**
   * 启用DDNS
   */
  enable_ddns: boolean;
  /**
   * 对游客隐藏
   */
  hide_for_guest?: boolean;
  host?: ModelHost;
  id: number;
  last_active?: string;
  name: string;
  /**
   * 管理员可见备注
   */
  note: string;
  /**
   * 公开备注
   */
  public_note: string;
  state: ModelHostState;
  updated_at: string;
  uuid: string;
}

export interface ModelHost {
  arch?: string;
  boot_time?: number;
  country_code?: string;
  cpu?: string[];
  disk_total?: number;
  gpu?: string[];
  ip?: string;
  mem_total?: number;
  platform?: string;
  platform_version?: string;
  swap_total?: number;
  version?: string;
  virtualization?: string;
}

export interface ModelHostState {
  cpu?: number;
  disk_used?: number;
  gpu?: number[];
  load_1?: number;
  load_15?: number;
  load_5?: number;
  mem_used?: number;
  net_in_speed?: number;
  net_in_transfer?: number;
  net_out_speed?: number;
  net_out_transfer?: number;
  process_count?: number;
  swap_used?: number;
  tcp_conn_count?: number;
  temperatures?: ModelSensorTemperature[];
  udp_conn_count?: number;
  uptime?: number;
}

export interface ModelSensorTemperature {
  name?: string;
  temperature?: number;
}
