import type { BaseResponse } from "@/types/apiResponse";

import type { AlbumFormData } from "@/schemas/albumSchema";
import type { Album } from "@/types/listenEntity";
import type { PagenationData, PagenationParam } from "@/types/systemEntity";
import apiClient from "../apiClient";

export enum Api {
	Base = "/listenadmin/api/album",
	Pagination = "/listenadmin/api/album/Pagination",
	List = "/listenadmin/api/album/List",
	findByCatagoryId = "/listenadmin/api/album/ListByCatagory",
	show = "/listenadmin/api/album/show",
	hide = "/listenadmin/api/album/hide",
}

const findById = (id: string) => apiClient.get<Album>({ url: `${Api.Base}/${id}` });
const findByCatagoryId = (categoryId: string) => apiClient.get<Album[]>({ url: `${Api.findByCatagoryId}/${categoryId}` });
const create = (data: AlbumFormData) => apiClient.post<BaseResponse>({ url: Api.Base, data });
const update = (id: string, data: AlbumFormData) => apiClient.put<BaseResponse>({ url: `${Api.Base}/${id}`, data });
const del = (id: string) => apiClient.delete<BaseResponse>({ url: `${Api.Base}/${id}` });
const getlist = () => apiClient.get<Album[]>({ url: Api.List });

const getpaginationlist = ({ pageIndex, pageSize, queryParams }: PagenationParam) =>
	apiClient.get<PagenationData<Album>>({
		url: Api.Pagination,
		params: { pageIndex, pageSize, ...queryParams },
	});
const getdetail = (id: string) => apiClient.get<Album>({ url: `${Api.Base}/${id}` });

export default {
	create,
	findById,
	update,
	del,
	getlist,
	getdetail,
	getpaginationlist,
	findByCatagoryId,
};
