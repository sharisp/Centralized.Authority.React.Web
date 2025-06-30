export default interface ApiResponse<T = unknown> {
	success: boolean;
	statusCode: number;
	errorMsg?: string;
	data?: T;
}

export interface BaseResponse {
	id: number;
}
