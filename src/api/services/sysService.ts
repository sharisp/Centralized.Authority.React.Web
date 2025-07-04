
import type { Sys } from "@/types/systemEntity";
import apiClient from "../apiClient";

enum SysApi {
  Sys = "/identity/api/sys",
}

const getlist = () => apiClient.get<Sys[]>({ url: SysApi.Sys });

export default {
  getlist
};
