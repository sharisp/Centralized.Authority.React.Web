import type { BaseResponse } from "@/types/apiResponse";
import type { PagenationData, PagenationParam, Role } from "@/types/systemEntity";
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
	//	Role = "/identity/api/role",
	Role = "/identity/api/role",
	RolePagination = "/identity/api/role/Pagination",
	Assign = "/identity/api/role/assign",
	Detail = "/identity/api/role/Detail",
}
export interface RoleCreate {
	id: number;
	roleName: string;
	description?: string;
	menuIds?: string[];
	permissionIds?: string[];
}
const create = (data: RoleCreate) => apiClient.post<BaseResponse>({ url: RoleApi.Role, data });
const update = (data: RoleCreate) => apiClient.put<BaseResponse>({ url: `${RoleApi.Role}/${data.id}`, data });
const del = (id: number) => apiClient.delete<BaseResponse>({ url: `${RoleApi.Role}/${id}` });
const getlist = () => apiClient.get<Role[]>({ url: RoleApi.Role });

const getpaginationlist = ({ pageIndex, pageSize, queryParams }: PagenationParam) => apiClient.get<PagenationData<Role>>({
	url: RoleApi.RolePagination,
	params: { pageIndex, pageSize, ...queryParams }
});
const getdetail = (id: number) => apiClient.get<Role>({ url: `${RoleApi.Detail}/${id}` });
const assign = (id: number, permissionIds: number[]) => apiClient.post<string>({ url: `${RoleApi.Assign}/${id}`, data: permissionIds });
export default {
	create,
	update,
	del,
	getlist,
	assign,
	getdetail,
	getpaginationlist,
};
