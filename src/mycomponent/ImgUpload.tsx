import { Icon } from "@/components/icon";
import { GLOBAL_CONFIG } from "@/global-config";
import userStore from "@/store/userStore";
import type ApiResponse from "@/types/apiResponse";
import { Button, Upload, type UploadProps, message } from "antd";
import { useState } from "react";
export function ImgUpload({ uploadSucessFunc }: { uploadSucessFunc: (url: any) => void }) {
	const [showuploadlist, setShowuploadlist] = useState(true);
	const accessToken = userStore.getState().userToken?.accessToken;
	//	console.log("设置 Authorization:", accessToken);
	const authorization = `Bearer ${accessToken}`;
	const props: UploadProps = {
		name: "file",
		listType: "picture",
		maxCount: 1,
		action: `${GLOBAL_CONFIG.baseApi}/fileservice/api/fileupload`,
		showUploadList: showuploadlist,
		headers: {
			authorization: authorization,
		},
		onChange(info) {
			setShowuploadlist(true);
			if (info.file.status !== "uploading") {
				console.log(info.file, info.fileList);
			}
			if (info.file.status === "done") {
				message.success(`${info.file.name} file uploaded successfully`);
				const resp: ApiResponse = info.file.response;
				if (resp?.success) {
					uploadSucessFunc(resp.data);
					setShowuploadlist(false);
				}
			} else if (info.file.status === "error") {
				message.error(`${info.file.name} file upload failed.`);
			}
		},
	};
	return (
		<>
			<Upload {...props}>
				<Button>
					<Icon icon="material-symbols:upload" />
					Click to Upload
				</Button>
			</Upload>
		</>
	);
}
