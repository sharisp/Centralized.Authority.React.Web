import type { BaseResponse } from "@/types/apiResponse";
import type { Role } from "@/types/systemEntity";
import apiClient from "../apiClient";
/*
export interface Role {
	id: number;
	roleName: string;
	Description?: string;
	CreateTime?: string;
}
*/
enum RoleApi {
	Role = "/identity/api/role",
	Assign = "/identity/api/role/assign",
	Detail = "/identity/api/role/Detail",
}

const create = (data: { roleName: string }) => apiClient.post<BaseResponse>({ url: RoleApi.Role, data });
const update = (data: { roleName: string }) => apiClient.put<BaseResponse>({ url: RoleApi.Role, data });
const del = (id: number) => apiClient.delete<BaseResponse>({ url: `${RoleApi.Role}/${id}` });
const getlist = () => apiClient.get<Role[]>({ url: RoleApi.Role });
const getdetail = (id: number) => apiClient.get<Role>({ url: `${RoleApi.Detail}/${id}` });
const assign = (id: number, permissionIds: number[]) => apiClient.post<string>({ url: `${RoleApi.Assign}/${id}`, data: permissionIds });
export default {
	create,
	update,
	del,
	getlist,
	assign,
	getdetail,
};
