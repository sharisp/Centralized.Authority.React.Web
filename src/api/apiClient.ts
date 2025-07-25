import { GLOBAL_CONFIG } from "@/global-config";
import { t } from "@/locales/i18n";
import userStore from "@/store/userStore";
import type ApiResponse from "@/types/apiResponse";
import axios, { type AxiosRequestConfig, type AxiosError, type AxiosResponse } from "axios";
//import { ResultStuts } from "#/enum";

const axiosInstance = axios.create({
	baseURL: GLOBAL_CONFIG.baseApi,
	timeout: 50000,
	headers: { "Content-Type": "application/json;charset=utf-8", "Ocp-Apim-Subscription-Key": "cac04f55f10e4e94b1353e6777c70a1e" },
});

axiosInstance.interceptors.request.use(
	(config) => {
		const accessToken = userStore.getState().userToken?.accessToken;
		//	console.log("设置 Authorization:", accessToken);
		config.headers.Authorization = `Bearer ${accessToken}`;
		return config;
	},
	(error) => Promise.reject(error),
);
axiosInstance.interceptors.response.use(
	(res: AxiosResponse<ApiResponse<any>>) => {
		console.log(res);
		//	if (!res.data) throw new Error(t("sys.api.apiRequestFailed"));
		const { success, data, statusCode, errorMsg } = res.data;
		if (statusCode === 401) {
			console.log(success, data, statusCode, errorMsg);
			userStore.getState().actions.clearUserInfoAndToken();
		}
		if (success) {
			return data;
		}
		throw new Error(errorMsg || t("sys.api.apiRequestFailed"));
	},
	(error: AxiosError<ApiResponse>) => {
		console.log("error", error);
		const { response, message } = error || {};
		const errMsg = response?.data?.errorMsg || message || t("sys.api.errorMessage");
		//toast.error(errMsg, { position: "top-center" });
		if (response?.status === 401) {
			userStore.getState().actions.clearUserInfoAndToken();
		}
		return Promise.reject(errMsg);
	},
);

class APIClient {
	get<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		const filteredParams = Object.fromEntries(Object.entries(config.params || {}).filter(([_, v]) => v !== undefined && v !== null && v !== ""));
		console.log(filteredParams);
		return this.request<T>({
			...config,
			method: "GET",
			params: filteredParams,
		});
	}
	post<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "POST" });
	}
	put<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "PUT" });
	}
	delete<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "DELETE" });
	}
	request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return axiosInstance.request<any, T>(config);
	}
}

export default new APIClient();
