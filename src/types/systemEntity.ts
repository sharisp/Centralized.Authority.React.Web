import type { UserMenus } from "./loginEntity";

export interface Role {
	id: number;
	roleName: string;
	description?: string;
	permissions: Permission[];
	menus: UserMenus[];
}
export interface Permission {
	id: string;
	title?: string;
	systemName?: string;
	permissionKey: string;
}
export interface PagenationParam {
	pageIndex: number;
	pageSize: number
	queryParams: any
}

export interface PagenationData<T> {
	totalCount: number;
	dataList: T[]
}

export interface User {
	id: number;
	userName: string;
	password: string;
	realName?: string;
	email?: string;
	roles: Role[];
}

export interface Sys {
	id: number;
	systemName: string;
	systemCode: string;
}
