import {
  LoginUserResponse,
  MonitorResponse,
  ServerGroupResponse,
  ServiceResponse,
  SettingResponse,
} from "@/types/nezha-api"

export const fetchServerGroup = async (): Promise<ServerGroupResponse> => {
  const response = await fetch("/api/v1/server-group")
  const data = await response.json()
  if (data.error) {
    throw new Error(data.error)
  }
  return data
}

export const fetchLoginUser = async (): Promise<LoginUserResponse> => {
  const response = await fetch("/api/v1/profile")
  const data = await response.json()
  if (data.error) {
    throw new Error(data.error)
  }
  return data
}

export const fetchMonitor = async (server_id: number): Promise<MonitorResponse> => {
  const response = await fetch(`/api/v1/service/${server_id}`)
  const data = await response.json()
  if (data.error) {
    throw new Error(data.error)
  }
  return data
}

export const fetchService = async (): Promise<ServiceResponse> => {
  const response = await fetch("/api/v1/service")
  const data = await response.json()
  if (data.error) {
    throw new Error(data.error)
  }
  return data
}

export const fetchSetting = async (): Promise<SettingResponse> => {
  const response = await fetch("/api/v1/setting")
  const data = await response.json()
  if (data.error) {
    throw new Error(data.error)
  }
  return data
}
