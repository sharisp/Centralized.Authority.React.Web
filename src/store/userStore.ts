import { useMutation } from "@tanstack/react-query";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import userService, { type SignInReq } from "@/api/services/userService";

import type { LoginUser, OAuthLogin, Token, UserMenus } from "@/types/loginEntity";
import { convertFlatToTree } from "@/utils/tree";
//import { toast } from "sonner";
//import type { UserInfo, UserToken } from "#/entity";
import { StorageEnum } from "#/enum";
import { useRouteStore } from "./routerStore";

type UserStore = {
	userInfo: Partial<LoginUser>;
	userToken: Token;

	actions: {
		setUserInfo: (userInfo: LoginUser) => void;
		setUserToken: (token: Token) => void;
		clearUserInfoAndToken: () => void;
		setUserMenus: (menus: UserMenus[]) => void;
	};
};

const useUserStore = create<UserStore>()(
	persist(
		(set, get) => ({
			userInfo: {},
			userToken: {},
			actions: {
				setUserInfo: (userInfo) => {
					set({ userInfo });
				},
				setUserToken: (userToken) => {
					set({ userToken });
				},
				clearUserInfoAndToken() {
					set({ userInfo: {}, userToken: {} });
				},
				setUserMenus: (menus) => {
					const ui = get().userInfo;
					set({ userInfo: { ...ui, menus } });
				},
			},
		}),
		{
			name: "userStore", // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
			partialize: (state) => ({
				[StorageEnum.UserInfo]: state.userInfo,
				[StorageEnum.UserToken]: state.userToken,
			}),
		},
	),
);

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserPermissions = () => useUserStore((state) => state.userInfo.permissions || []);
export const useUserRoles = () => useUserStore((state) => state.userInfo.roles || []);
export const useUserActions = () => useUserStore((state) => state.actions);

export const useSignIn = () => {
	const { setUserToken, setUserInfo } = useUserActions();

	const signInMutation = useMutation({
		mutationFn: userService.signin,
	});

	const signIn = async (data: SignInReq) => {
		const res = await signInMutation.mutateAsync(data);

		const { token, ...user } = res;
		console.log(token);
		console.log(user);
		setUserToken(token);
		setUserInfo(user);
		const routerTree = convertFlatToTree(user.menus ?? []);

		//	const routes = convertToRoute(tree);

		//console.log(tree, routes, getBackendDashboardRoutes());
		useRouteStore.getState().setRoutes(routerTree);
		return res;
	};

	return signIn;
};

export const useOAuthSignIn = () => {
	const { setUserToken, setUserInfo } = useUserActions();

	const signInMutation = useMutation({
		mutationFn: userService.oauth,
	});

	const signIn = async (data: OAuthLogin) => {
		const res = await signInMutation.mutateAsync(data);

		const { token, ...user } = res;
		console.log(token);
		console.log(user);
		setUserToken(token);
		setUserInfo(user);
		const routerTree = convertFlatToTree(user.menus ?? []);

		//	const routes = convertToRoute(tree);

		//console.log(tree, routes, getBackendDashboardRoutes());
		useRouteStore.getState().setRoutes(routerTree);
	};

	return signIn;
};
export default useUserStore;
