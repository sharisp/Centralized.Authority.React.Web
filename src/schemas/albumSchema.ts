import type { Album } from "@/types/listenEntity";

import { z } from "zod";

export const AlbumFormSchema = z.object({
	title: z.string().nonempty("Title is required"),
	sequenceNumber: z.string().nonempty("sequenceNumber required"),
	coverImgUrl: z.string().url().optional(),
	categoryId: z.string().nonempty("categoryId required"),
});

export type AlbumFormData = z.infer<typeof AlbumFormSchema>;

export function ConvertToFormData(info: Album): AlbumFormData {
	return {
		title: info.title,
		sequenceNumber: info.sequenceNumber,
		coverImgUrl: info.coverImgUrl ? info.coverImgUrl.toString() : undefined,
		categoryId: info.categoryId,
	};
}
