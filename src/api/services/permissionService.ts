import { PagenationData, PagenationParam, Permission } from "@/types/systemEntity";
import apiClient from "../apiClient";
import { BaseResponse } from "@/types/apiResponse";


export enum PermissionApi {
	Permission = "/identity/api/Permission",
	Pagination = "/identity/api/Permission/Pagination",
	Detail = "/identity/api/Permission/Detail",
}

const findById = (id: string) => apiClient.get<Permission>({ url: `${PermissionApi.Detail}/${id}` });

const create = (data: Permission) => apiClient.post<BaseResponse>({ url: PermissionApi.Permission, data });
const update = (id: string, data: Permission) => apiClient.put<BaseResponse>({ url: `${PermissionApi.Permission}/${id}`, data });
const del = (id: string) => apiClient.delete<BaseResponse>({ url: `${PermissionApi.Permission}/${id}` });
const getlist = () => apiClient.get<Permission[]>({ url: PermissionApi.Permission });

const getpaginationlist = ({ pageIndex, pageSize, queryParams }: PagenationParam) => apiClient.get<PagenationData<Permission>>({
	url: PermissionApi.Pagination,
	params: { pageIndex, pageSize, ...queryParams }
});
const getdetail = (id: string) => apiClient.get<Permission>({ url: `${PermissionApi.Detail}/${id}` });

export default {
	create,
	findById,
	update,
	del,
	getlist,
	getdetail,
	getpaginationlist,
};
