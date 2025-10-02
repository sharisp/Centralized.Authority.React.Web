import type { Episode } from "@/types/listenEntity";

import { z } from "zod";

export const EpisodeFormSchema = z
	.object({
		title: z.string().nonempty("Title is required"),
		sequenceNumber: z.string().nonempty("sequenceNumber required"),
		coverImgUrl: z.string().url().or(z.literal("")).optional(),
		albumId: z.string().nonempty("albumId required"),
		subtitleType: z.string().optional(),
		subtitleContent: z.string().optional(),
		//subtitleContent: z.string().nonempty("subtitleContent required"),
		audioUrl: z.string(), //.nonempty("audioUrl required"),
	})
	.refine(
		(data) => {
			if (data.subtitleType !== "AI_Generate") {
				return !!data.subtitleContent; // 必须有值
			}
			return true;
		},
		{
			path: ["subtitleContent"],
			message: "subtitleContent is required",
		},
	);

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
