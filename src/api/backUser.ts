import request from "@/api/request.ts";

export const getBackUserList = (params: any) => {
  return request.get("/users", { params });
};