//import type { MenuTree, Permission, Role } from "./entity";
import type { NavItemDataProps } from "@/components/nav/types";
import type { BasicStatus } from "./enum";

export interface Token {
	accessTokenExpiresAt?: string;
	refreshTokenExpiresAt?: string;
	accessToken?: string;
	refreshToken?: string;
}

export interface UserLoginResponse extends LoginUser {
	token: Token;
}
export interface LoginUser {
	userName: string;
	nickName: string | null;
	userId: number;
	email: string;
	roles?: UserRole[];
	status?: BasicStatus;
	permissions?: UserPermissions[];
	menus?: UserMenus[];
}

export interface UserRole {
	id: number;
	roleName: string;
}
export interface UserMenus extends MenusMetaInfo {
	id: string;
	title: string;
	path: string;
	parentId: string;
	//component?: string;
	icon?: string | null;
	sort: number;
	type: MenuType;
	isShow: boolean;
	description?: string;
	//externalLink?: string | null;
	systemName: string;
}
export enum MenuType {
	Group = 0,
	Catelogue = 1,
	Menu = 2,
}

export interface UserPermissions {
	id: number;
	title: string;
	permissionKey: string;
}
export type MenusTree = UserMenus & {
	children?: MenusTree[];
};
export type MenusMetaInfo = Partial<Pick<NavItemDataProps, "path" | "icon" | "caption" | "info" | "disabled" | "auth" | "hidden">> & {
	externalLink?: URL;
	component?: string;
};
