import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";

import episodeService from "@/api/services/episodeService";

import albumService from "@/api/services/albumService";
import categoryService from "@/api/services/categoryService";
import { FileUpload } from "@/mycomponent/FileUpload";
import { type EpisodeFormData, EpisodeFormSchema } from "@/schemas/episodeSchema";
import type { Album, Category, Kind } from "@/types/listenEntity";
import type { ModalProps } from "@/types/types";
import { Textarea } from "@/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "antd";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function EpisodeModal({ title, show, id, formValue, onOk, onCancel, kinds }: ModalProps<EpisodeFormData> & { kinds: Kind[] }) {
	const isCreate = id === "0" || id === "";

	const [categories, setCategories] = useState<Category[]>([]);
	//	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [categoryId, setCategoryId] = useState<string>("");
	const [isloading, setloading] = useState(false);
	const [albums, setAlbums] = useState<Album[]>([]);
	const form = useForm<EpisodeFormData>({
		resolver: zodResolver(EpisodeFormSchema),
		defaultValues: formValue,
	});

	const onSubmit = async () => {
		setloading(true);
		const model: EpisodeFormData = form.getValues();

		try {
			if (!model.subtitleType) {
				model.subtitleType = "json";
			}
			if (id === "0") {
				//new
				await episodeService.create(model);
			} else {
				await episodeService.update(id.toString(), model);
			}

			toast.success("operate success");
			onOk();
		} catch (error) {
			toast.error(`operation error,${error}`);
		} finally {
			setloading(false);
		}
	};

	useEffect(() => {
		form.reset(formValue);
	}, [formValue, form]);

	return (
		<Dialog open={show} onOpenChange={(open) => !open && onCancel()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Title</FormLabel>
									<div className="col-span-3">
										<FormControl>{<Input {...field} />}</FormControl>
										{fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
									</div>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="sequenceNumber"
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4" hidden={isCreate}>
									<FormLabel className="text-right">sequenceNumber</FormLabel>
									<div className="col-span-3">
										<FormControl>{<Input type="number" {...field} />}</FormControl>
										{fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
									</div>
								</FormItem>
							)}
						/>
						<FormItem className="grid grid-cols-4 items-center gap-4" hidden={isCreate === false}>
							<FormLabel className="text-right">Kind</FormLabel>
							<div className="col-span-3">
								<Select
									placeholder="Select Kind"
									getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
									options={kinds}
									style={{ width: "100%" }}
									fieldNames={{
										label: "title",
										value: "id",
									}}
									onChange={(id) => {
										if (id) {
											setCategories([]);
											setCategoryId("");
											form.setValue("albumId", "");
											setAlbums([]);
											categoryService
												.findByKindId(id)
												.then((data) => {
													setCategories(data);
												})
												.catch((error) => toast.error(error));
										}
									}}
								/>
							</div>
						</FormItem>

						<FormItem hidden={isCreate === false} className="grid grid-cols-4 items-center gap-4">
							<FormLabel className="text-right">Category</FormLabel>
							<div className="col-span-3">
								<FormControl>
									<Select
										disabled={isCreate === false}
										style={{ width: "100%" }}
										value={categoryId}
										onChange={(id) => {
											if (id) {
												setAlbums([]);
												form.setValue("albumId", "");
												setCategoryId(id);
												form.resetField("albumId");
												albumService
													.findByCatagoryId(id)
													.then((data) => {
														setAlbums(data);
													})
													.catch((error) => toast.error(error));
											}
										}}
										fieldNames={{
											label: "title",
											value: "id",
										}}
										options={categories}
										getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
									/>
								</FormControl>
							</div>
						</FormItem>

						<FormField
							control={form.control}
							name="albumId"
							render={({ field, fieldState }) => (
								<FormItem hidden={isCreate === false} className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Album</FormLabel>
									<div className="col-span-3">
										<FormControl>
											<Select
												{...field}
												disabled={isCreate === false}
												style={{ width: "100%" }}
												onChange={(value) => field.onChange(value)}
												fieldNames={{
													label: "title",
													value: "id",
												}}
												options={albums}
												getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
											/>
										</FormControl>
										{fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="audioUrl"
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">audio</FormLabel>
									<div className="col-span-3">
										<FormControl>{<Input hidden={true} {...field} />}</FormControl>
										<>
											<FileUpload
												fileTypes={["audio/mpeg", "audio/mp4", "audio/x-m4a"]}
												uploadSucessFunc={(url: string) => {
													form.setValue("audioUrl", url);
												}}
											/>
											<FormControl>{<Input hidden={true} {...field} />}</FormControl>

											{fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
											{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
											<audio hidden={isCreate} src={field.value} controls preload="metadata">
												Your browser does not support the audio element.
											</audio>
										</>
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="subtitleType"
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">subtitleType</FormLabel>
									<div className="col-span-3">
										<FormControl>
											{
												<Select
													{...field}
													style={{ width: "100%" }}
													onChange={(data) => field.onChange(data)}
													value={field.value ? field.value : "json"}
													getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
													options={[
														{ value: "json", label: "json" },
														{ value: "lrc", label: "lrc" },
														{ value: "srt", label: "srt" },
														{ value: "vtt", label: "vtt" },
													]}
												/>
											}
										</FormControl>

										{fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="subtitleContent"
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">subtitleContent</FormLabel>
									<div className="col-span-3">
										<FormControl>{<Textarea {...field} className="max-h-36" />}</FormControl>
										{fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="coverImgUrl"
							render={({ field, fieldState }) => (
								<FormItem hidden={true} className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">coverImgUrl</FormLabel>
									<div className="col-span-3">
										<FormControl>{<Input {...field} />}</FormControl>
										{fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
									</div>
								</FormItem>
							)}
						/>
					</div>
				</Form>
				<DialogFooter>
					<Button variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<Button
						onClick={() => {
							form.handleSubmit(onSubmit)();
						}}
						disabled={isloading}
					>
						{isloading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{isloading ? "Submitting..." : "Submit"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
