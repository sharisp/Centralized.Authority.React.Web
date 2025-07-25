import type { UserMenus } from "./loginEntity";

export interface Role {
	id: string;
	roleName: string;
	description?: string;
	permissions: Permission[];
	menus: UserMenus[];
}
export interface Permission {
	id: string;
	title: string;
	systemName: string;
	permissionKey: string;
}
export interface PagenationParam {
	pageIndex: number;
	pageSize: number;
	queryParams: any;
}

export interface PagenationData<T> {
	totalCount: number;
	dataList: T[];
}

export interface User {
	id: string;
	userName: string;
	password: string;
	realName?: string;
	email: string;
	roles: Role[];
}

export interface Sys {
	id: string;
	systemName: string;
	systemCode: string;
}
