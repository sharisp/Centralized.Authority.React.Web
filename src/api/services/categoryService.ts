import type { BaseResponse } from "@/types/apiResponse";

import type { CategoryFormData } from "@/schemas/categorySchema";
import type { Category } from "@/types/listenEntity";
import type { PagenationData, PagenationParam } from "@/types/systemEntity";
import apiClient from "../apiClient";

export enum Api {
	Base = "/listenadmin/api/Category",
	Pagination = "/listenadmin/api/Category/Pagination",
	findByKindId = "/listenadmin/api/Category/ListByKind",
	List = "/listenadmin/api/Category/List",
	show = "/listenadmin/api/Category/show",
	hide = "/listenadmin/api/Category/hide",
}

const findById = (id: string) => apiClient.get<Category>({ url: `${Api.Base}/${id}` });

const findByKindId = (kindId: string) => apiClient.get<Category[]>({ url: `${Api.findByKindId}/${kindId}` });
const create = (data: CategoryFormData) => apiClient.post<BaseResponse>({ url: Api.Base, data });
const update = (id: string, data: CategoryFormData) => apiClient.put<BaseResponse>({ url: `${Api.Base}/${id}`, data });
const del = (id: string) => apiClient.delete<BaseResponse>({ url: `${Api.Base}/${id}` });
const getlist = () => apiClient.get<Category[]>({ url: Api.List });

const getpaginationlist = ({ pageIndex, pageSize, queryParams }: PagenationParam) =>
	apiClient.get<PagenationData<Category>>({
		url: Api.Pagination,
		params: { pageIndex, pageSize, ...queryParams },
	});
const getdetail = (id: string) => apiClient.get<Category>({ url: `${Api.Base}/${id}` });

export default {
	create,
	findById,
	update,
	del,
	findByKindId,
	getlist,
	getdetail,
	getpaginationlist,
};
