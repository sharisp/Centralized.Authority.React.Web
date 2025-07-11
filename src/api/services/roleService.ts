import type { RoleFormData } from "@/schemas/roleFormSchema";
import type { BaseResponse } from "@/types/apiResponse";
import type { PagenationData, PagenationParam, Role } from "@/types/systemEntity";
import apiClient from "../apiClient";
/*
export interface Role {
	id: string;
	roleName: string;
	Description?: string;
	CreateTime?: string;
}
*/
enum RoleApi {
	//	Role = "/api/role",
	Role = "/identity/api/role",
	RolePagination = "/identity/api/role/Pagination",
	Assign = "/identity/api/role/assign",
	Detail = "/identity/api/role/Detail",
}
export interface RoleCreate {
	id: string;
	roleName: string;
	description?: string;
	menuIds?: string[];
	permissionIds?: string[];
}
const create = (data: RoleFormData) => apiClient.post<BaseResponse>({ url: RoleApi.Role, data });
const update = (id: string, data: RoleFormData) => apiClient.put<BaseResponse>({ url: `${RoleApi.Role}/${id}`, data });
const del = (id: string) => apiClient.delete<BaseResponse>({ url: `${RoleApi.Role}/${id}` });
const getlist = () => apiClient.get<Role[]>({ url: RoleApi.Role });

const getpaginationlist = ({ pageIndex, pageSize, queryParams }: PagenationParam) =>
	apiClient.get<PagenationData<Role>>({
		url: RoleApi.RolePagination,
		params: { pageIndex, pageSize, ...queryParams },
	});
const getdetail = (id: string) => apiClient.get<Role>({ url: `${RoleApi.Detail}/${id}` });
const assign = (id: string, permissionIds: number[]) => apiClient.post<string>({ url: `${RoleApi.Assign}/${id}`, data: permissionIds });
export default {
	create,
	update,
	del,
	getlist,
	assign,
	getdetail,
	getpaginationlist,
};
