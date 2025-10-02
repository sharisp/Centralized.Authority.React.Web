import type { BaseResponse } from "@/types/apiResponse";

import type { EpisodeFormData } from "@/schemas/episodeSchema";
import type { Episode } from "@/types/listenEntity";
import type { PagenationData, PagenationParam } from "@/types/systemEntity";
import apiClient from "../apiClient";

export enum Api {
	Base = "/listenadmin/api/episode",
	Pagination = "/listenadmin/api/episode/Pagination",
	List = "/listenadmin/api/episode/List",
	findByAlbum = "/listenadmin/api/episode/ListByAlbum",
	show = "/listenadmin/api/episode/show",
	hide = "/listenadmin/api/episode/hide",
}

const findById = (id: string) => apiClient.get<Episode>({ url: `${Api.Base}/${id}` });
const findByAlbum = (albumId: string) => apiClient.get<Episode[]>({ url: `${Api.findByAlbum}/${albumId}` });
const create = (data: EpisodeFormData) => apiClient.post<BaseResponse>({ url: Api.Base, data });
const update = (id: string, data: EpisodeFormData) => apiClient.put<BaseResponse>({ url: `${Api.Base}/${id}`, data });
const del = (id: string) => apiClient.delete<BaseResponse>({ url: `${Api.Base}/${id}` });
const getlist = () => apiClient.get<Episode[]>({ url: Api.List });

const getpaginationlist = ({ pageIndex, pageSize, queryParams }: PagenationParam) =>
	apiClient.get<PagenationData<Episode>>({
		url: Api.Pagination,
		params: { pageIndex, pageSize, ...queryParams },
	});
const getdetail = (id: string) => apiClient.get<Episode>({ url: `${Api.Base}/${id}` });

export default {
	create,
	findById,
	update,
	del,
	getlist,
	getdetail,
	getpaginationlist,
	findByAlbum,
};
