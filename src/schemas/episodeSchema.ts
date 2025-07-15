import type { Episode } from "@/types/listenEntity";

import { z } from "zod";

export const EpisodeFormSchema = z.object({
	title: z.string().nonempty("Title is required"),
	sequenceNumber: z.string().nonempty("sequenceNumber required"),
	coverImgUrl: z.string().url().optional(),
	albumId: z.string().nonempty("albumId required"),
	subtitleType: z.string().optional(),
	subtitleContent: z.string().nonempty("subtitleContent required"),
	audioUrl: z.string(), //.nonempty("audioUrl required"),
});

export type EpisodeFormData = z.infer<typeof EpisodeFormSchema>;

export function ConvertToFormData(info: Episode): EpisodeFormData {
	return {
		title: info.title,
		sequenceNumber: info.sequenceNumber,
		coverImgUrl: info.coverImgUrl ? info.coverImgUrl.toString() : undefined,
		albumId: info.albumId,
		audioUrl: info.audioUrl,
		subtitleContent: info.subtitleContent,
		subtitleType: info.subtitleType,
	};
}
