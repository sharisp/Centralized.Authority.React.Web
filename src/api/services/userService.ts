import apiClient from "../apiClient";

import type { UserLoginResponse } from "@/types/loginEntity";
import type { UserInfo, UserToken } from "#/entity";
import { PagenationData, PagenationParam, User } from "@/types/systemEntity";
import { BaseResponse } from "@/types/apiResponse";

export interface SignInReq {
	username: string;
	password: string;
	systemName: string;
}

export interface SignUpReq extends SignInReq {
	email: string;
}
export type SignInRes = UserToken & { user: UserInfo };

export enum UserApi {
	SignIn = "/identity/api/login/weblogin",

	Logout = "/identity/api/login/logout",
	Refresh = "/identity/api/login/RefreshToken",
	RolePagination = "/identity/api/user/pagination",
	User = "/identity/api/user",
}
export interface UserCreate {
	userName: string;
	realName?: string;
	email?: string;
	roleIds: Number[];
}
const signin = (data: SignInReq) => apiClient.post<UserLoginResponse>({ url: UserApi.SignIn, data });

const logout = () => apiClient.get({ url: UserApi.Logout });
const findById = (id: Number) => apiClient.get<UserInfo[]>({ url: `${UserApi.User}/${id}` });

const del = (id: Number) => apiClient.delete<BaseResponse>({ url: `${UserApi.User}/${id}` });

const create = (data: UserCreate) => apiClient.post<BaseResponse>({ url: UserApi.User, data });
const update = (id: Number, data: UserCreate) => apiClient.put<BaseResponse>({ url: `${UserApi.User}/${id}`, data });
const getpaginationlist = ({ pageIndex, pageSize, queryParams }: PagenationParam) => apiClient.get<PagenationData<User>>({
	url: UserApi.RolePagination,
	params: { pageIndex, pageSize, ...queryParams }
});
export default {
	signin,
	create,
	update,
	findById,
	logout,
	getpaginationlist,
	del
};
