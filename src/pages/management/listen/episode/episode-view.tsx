import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";

import type { EpisodeFormData } from "@/schemas/episodeSchema";
import type { Subtitle } from "@/types/listenEntity";
import type { ModalProps } from "@/types/types";
import { removeMilliseconds } from "@/utils/format-time";
import { List } from "antd";
import { useEffect, useState } from "react";

export function EpisodeViewModal({ title, show, formValue, onCancel }: ModalProps<EpisodeFormData>) {
	const [subtitles, setSubtitles] = useState<string[]>([]);
	useEffect(() => {
		const arr: string[] = [];
		if (formValue.subtitleContent) {
			const data: Subtitle[] = JSON.parse(formValue.subtitleContent);
			for (const element of data) {
				//	console.log(element)
				//	arr.push(`${element.Content}`);
				arr.push(`${removeMilliseconds(element.StartTime)} ${element.Content}`);
			}
		}
		setSubtitles(arr);
	}, [formValue]);

	return (
		<Dialog open={show} onOpenChange={(open) => !open && onCancel()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
					<audio src={formValue.audioUrl} controls preload="metadata">
						Your browser does not support the audio element.
					</audio>
				</DialogHeader>
				<div
					id="scrollableDiv"
					style={{
						height: 400,
						overflow: "auto",
						padding: "0 16px",
						border: "1px solid rgba(140, 140, 140, 0.35)",
					}}
				>
					<List size="small" bordered dataSource={subtitles} renderItem={(item) => <List.Item>{item}</List.Item>} />
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onCancel}>
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
