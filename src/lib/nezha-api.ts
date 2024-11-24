import { LoginUserResponse, ServerGroupResponse } from "@/types/nezha-api";

export const fetchServerGroup = async (): Promise<ServerGroupResponse> => {
  const response = await fetch("/api/v1/server-group");
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
};

export const fetchLoginUser = async (): Promise<LoginUserResponse> => {
  const response = await fetch("/api/v1/profile");
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
};
