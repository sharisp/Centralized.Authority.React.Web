import type { KindFormData } from "@/schemas/kindSchema";
import type { BaseResponse } from "@/types/apiResponse";
import type { Kind } from "@/types/listenEntity";
import type { PagenationData, PagenationParam } from "@/types/systemEntity";
import apiClient from "../apiClient";

export enum Api {
	Base = "/listenadmin/api/Kind",
	Pagination = "/listenadmin/api/Kind/Pagination",
	List = "/listenadmin/api/Kind/List",
	show = "/listenadmin/api/Kind/show",
	hide = "/listenadmin/api/Kind/hide",
}

const findById = (id: string) => apiClient.get<Kind>({ url: `${Api.Base}/${id}` });

const create = (data: KindFormData) => apiClient.post<BaseResponse>({ url: Api.Base, data });
const update = (id: string, data: KindFormData) => apiClient.put<BaseResponse>({ url: `${Api.Base}/${id}`, data });
const del = (id: string) => apiClient.delete<BaseResponse>({ url: `${Api.Base}/${id}` });
const getlist = () => apiClient.get<Kind[]>({ url: Api.List });

const getpaginationlist = ({ pageIndex, pageSize, queryParams }: PagenationParam) =>
	apiClient.get<PagenationData<Kind>>({
		url: Api.Pagination,
		params: { pageIndex, pageSize, ...queryParams },
	});
const getdetail = (id: string) => apiClient.get<Kind>({ url: `${Api.Base}/${id}` });

export default {
	create,
	findById,
	update,
	del,
	getlist,
	getdetail,
	getpaginationlist,
};
