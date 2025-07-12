import type { Category } from "@/types/listenEntity";

import { z } from "zod";

export const categoryFormSchema = z.object({
	title: z.string().nonempty("Title is required"),
	sequenceNumber: z.string().nonempty("sequenceNumber required"),
	coverImgUrl: z.string().url().optional(),
	kindId: z.string().nonempty("kindId required"),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;

export function ConvertToFormData(info: Category): CategoryFormData {
	return {
		title: info.title,
		sequenceNumber: info.sequenceNumber,
		coverImgUrl: info.coverImgUrl ? info.coverImgUrl.toString() : undefined,
		kindId: info.kindId,
	};
}
