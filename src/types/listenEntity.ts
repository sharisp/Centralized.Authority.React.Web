export interface Kind {
	id: string;
	title: string;
	sequenceNumber: string;
	coverImgUrl?: URL;
	createDateTime: Date;
	description?: string;
}
export interface Category extends Kind {
	kindId: string;
}
export interface Album extends Kind {
	categoryId: string;
}
export interface Episode extends Kind {
	albumId: string;
	subtitleType: string;
	subtitleContent: string;
	audioUrl: string;
}
export interface Subtitle {
	StartTime: string;
	EndTime: string;
	Content: string;
}
