import apiClient from "../apiClient";

import type { changePwdData } from "@/schemas/changepwdSchema";
import type { UserFormData } from "@/schemas/userFormSchema";
import type { BaseResponse } from "@/types/apiResponse";
import type { UserLoginResponse } from "@/types/loginEntity";
import type { PagenationData, PagenationParam, User } from "@/types/systemEntity";
import type { UserInfo, UserToken } from "#/entity";

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
	changePwd = "/identity/api/user/ChangePwd",
}

const signin = (data: SignInReq) => apiClient.post<UserLoginResponse>({ url: UserApi.SignIn, data });

const logout = () => apiClient.get({ url: UserApi.Logout });
const findById = (id: string) => apiClient.get<User>({ url: `${UserApi.User}/${id}` });

const del = (id: string) => apiClient.delete<BaseResponse>({ url: `${UserApi.User}/${id}` });

const create = (data: UserFormData) => apiClient.post<BaseResponse>({ url: UserApi.User, data });
const update = (id: string, data: UserFormData) => apiClient.put<BaseResponse>({ url: `${UserApi.User}/${id}`, data });
const changepwd = (data: changePwdData) => apiClient.put<BaseResponse>({ url: UserApi.changePwd, data });
const getpaginationlist = ({ pageIndex, pageSize, queryParams }: PagenationParam) =>
	apiClient.get<PagenationData<User>>({
		url: UserApi.RolePagination,
		params: { pageIndex, pageSize, ...queryParams },
	});
export default {
	signin,
	create,
	update,
	findById,
	logout,
	getpaginationlist,
	del,
	changepwd,
};
