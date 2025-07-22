import type { BaseResponse } from "@/types/apiResponse";

import apiClient from "../apiClient";

const handleput = (id: string, apiurl: string) => apiClient.put<BaseResponse>({ url: `${apiurl}/${id}` });

export default {
	handleput,
};
