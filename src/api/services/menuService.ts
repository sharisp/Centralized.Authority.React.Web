import apiClient from "../apiClient";

//import type { Menu } from "#/entity";
import type { UserMenus } from "@/types/loginEntity";

export enum MenuApi {
	UserMenu = "/Identity/api/User/ListMenus",
	AllMenu = "/Identity/api/Menu",
	AllMenuWithPermission = "/Identity/api/Menu/ListWithPermission",
}

const getUserMenuList = (systemname: string) => apiClient.get<UserMenus[]>({ url: `${MenuApi.UserMenu}/${systemname}` });

const getAllMenuList = (systemname: string) => apiClient.get<UserMenus[]>({ url: `${MenuApi.AllMenu}/${systemname}` });
const getAllMenuListWithPermission = (systemname: string) => apiClient.get<UserMenus[]>({ url: `${MenuApi.AllMenuWithPermission}/${systemname}` });
//const findById = (id: string) => apiClient.get<UserInfo[]>({ url: `${UserApi.User}/${id}` });
export default {
	getUserMenuList,
	getAllMenuList,
	getAllMenuListWithPermission,
};
