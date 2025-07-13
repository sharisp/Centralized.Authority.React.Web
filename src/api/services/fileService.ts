import apiClient from "../apiClient";

enum Api {
	Base = "/fileservice/api/fileupload",
}

const upload = (formData: FormData) =>
	apiClient.post<string>({
		url: `${Api.Base}`,
		data: formData,
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

export default {
	upload,
};
