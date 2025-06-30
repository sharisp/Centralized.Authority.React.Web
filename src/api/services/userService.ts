import apiClient from "../apiClient";

import type { UserLoginResponse } from "@/types/loginEntity";
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
	SignUp = "/auth/signup",
	Logout = "/identity/api/login/logout",
	Refresh = "/identity/api/login/RefreshToken",
	User = "/user",
}

const signin = (data: SignInReq) => apiClient.post<UserLoginResponse>({ url: UserApi.SignIn, data });
const signup = (data: SignUpReq) => apiClient.post<SignInRes>({ url: UserApi.SignUp, data });
const logout = () => apiClient.get({ url: UserApi.Logout });
const findById = (id: string) => apiClient.get<UserInfo[]>({ url: `${UserApi.User}/${id}` });

export default {
	signin,
	signup,
	findById,
	logout,
};
