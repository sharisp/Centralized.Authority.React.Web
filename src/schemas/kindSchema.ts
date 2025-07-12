import type { Kind } from "@/types/listenEntity";
import { z } from "zod";

export const kindFormSchema = z.object({
	title: z.string().nonempty("Title is required"),
	sequenceNumber: z.string().nonempty("sequenceNumber required"),
	coverImgUrl: z.string().url().optional(),
});

export type KindFormData = z.infer<typeof kindFormSchema>;

export function ConvertToFormData(info: Kind): KindFormData {
	return {
		title: info.title,
		sequenceNumber: info.sequenceNumber,
		coverImgUrl: info.coverImgUrl ? info.coverImgUrl.toString() : undefined,
	};
}
