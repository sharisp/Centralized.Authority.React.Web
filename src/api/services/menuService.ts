import { PagenationData, PagenationParam } from "@/types/systemEntity";
import apiClient from "../apiClient";

//import type { Menu } from "#/entity";
import type { UserMenus } from "@/types/loginEntity";
import { BaseResponse } from "@/types/apiResponse";

export enum MenuApi {
	UserMenu = "/Identity/api/User/ListMenus",
	Menu = "/Identity/api/Menu",
	Pagination = "/Identity/api/Menu/Pagination",
	AllMenuWithPermission = "/Identity/api/Menu/ListWithPermission",
	Detail = "/Identity/api/Menu/detail",
}

const findById = (id: string) => apiClient.get<UserMenus>({ url: `${MenuApi.Detail}/${id}` });

const create = (data: UserMenus & { permissionIds: string[] }) => apiClient.post<BaseResponse>({ url: MenuApi.Menu, data });
const update = (id: string, data: UserMenus & { permissionIds: string[] }) => apiClient.put<BaseResponse>({ url: `${MenuApi.Menu}/${id}`, data });
const getUserMenuList = (systemname: string) => apiClient.get<UserMenus[]>({ url: `${MenuApi.UserMenu}/${systemname}` });
const getpaginationlist = ({ pageIndex, pageSize, queryParams }: PagenationParam) => apiClient.get<PagenationData<UserMenus>>({
	url: MenuApi.Pagination,
	params: { pageIndex, pageSize, ...queryParams }
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
	del
};
