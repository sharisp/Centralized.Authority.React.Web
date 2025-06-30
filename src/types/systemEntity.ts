import type { UserMenus } from "./loginEntity";

export interface Role {
	id: number;
	roleName: string;
	description?: string;
	permissions: Permission[];
	menus: UserMenus[];
}
export interface Permission {
	id: number;
	title?: string;
	systemName?: string;
	permissionKey: string;
}
