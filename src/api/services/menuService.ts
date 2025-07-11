import type { PagenationData, PagenationParam } from "@/types/systemEntity";
import apiClient from "../apiClient";

import type { MenuFormData } from "@/schemas/menuSchema";
import type { BaseResponse } from "@/types/apiResponse";
//import type { Menu } from "#/entity";
import type { UserMenus } from "@/types/loginEntity";

export enum MenuApi {
	UserMenu = "/identity/api/User/ListMenus",
	Menu = "/identity/api/Menu",
	Pagination = "/identity/api/Menu/Pagination",
	AllMenuWithPermission = "/identity/api/Menu/ListWithPermission",
	Detail = "/identity/api/Menu/detail",
}

const findById = (id: string) => apiClient.get<UserMenus>({ url: `${MenuApi.Detail}/${id}` });

const create = (data: MenuFormData) => apiClient.post<BaseResponse>({ url: MenuApi.Menu, data });
const update = (id: string, data: MenuFormData) => apiClient.put<BaseResponse>({ url: `${MenuApi.Menu}/${id}`, data });
const getUserMenuList = (systemname: string) => apiClient.get<UserMenus[]>({ url: `${MenuApi.UserMenu}/${systemname}` });
const getpaginationlist = ({ pageIndex, pageSize, queryParams }: PagenationParam) =>
	apiClient.get<PagenationData<UserMenus>>({
		url: MenuApi.Pagination,
		params: { pageIndex, pageSize, ...queryParams },
	});
const del = (id: string) => apiClient.delete<BaseResponse>({ url: `${MenuApi.Menu}/${id}` });
const getAllMenuList = (systemname: string) => apiClient.get<UserMenus[]>({ url: MenuApi.Menu, params: { systemname } });
const getAllMenuListWithPermission = (systemname: string) => apiClient.get<UserMenus[]>({ url: `${MenuApi.AllMenuWithPermission}/${systemname}` });
//const findById = (id: string) => apiClient.get<UserInfo[]>({ url: `${UserApi.User}/${id}` });
export default {
	getUserMenuList,
	getAllMenuList,
	getAllMenuListWithPermission,
	getpaginationlist,
	findById,
	create,
	update,
	del,
};
