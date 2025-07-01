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
