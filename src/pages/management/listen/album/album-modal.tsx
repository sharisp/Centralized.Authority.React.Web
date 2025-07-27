import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";

import albumService from "@/api/services/albumService";

import categoryService from "@/api/services/categoryService";

import { FileUpload } from "@/mycomponent/FileUpload";
import { type AlbumFormData, AlbumFormSchema } from "@/schemas/albumSchema";
import type { Category, Kind } from "@/types/listenEntity";
import type { ModalProps } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "antd";
import { toast } from "sonner";

export function AlbumModal({ title, show, id, formValue, onOk, onCancel, kinds }: ModalProps<AlbumFormData> & { kinds: Kind[] }) {
	const isCreate = id === "0" || id === "";

	const [categories, setCategories] = useState<Category[]>([]);
	const form = useForm<AlbumFormData>({
		resolver: zodResolver(AlbumFormSchema),
		defaultValues: formValue,
	});

	const onSubmit = async () => {
		const model: AlbumFormData = form.getValues();

		try {
			if (id === "0") {
				//new
				await albumService.create(model);
			} else {
				await albumService.update(id.toString(), model);
			}

			toast.success("operate success");
			onOk();
		} catch (error) {
			toast.error(`operation error,${error}`);
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
											form.resetField("categoryId");
											categoryService
												.findByKindId(id)
												.then((data) => {
													setCategories(data);
													if (data.length > 0) {
														form.setValue("categoryId", data[0].id);
													}
												})
												.catch((error) => toast.error(error));
										}
									}}
								/>
							</div>
						</FormItem>
						<FormField
							control={form.control}
							name="categoryId"
							render={({ field, fieldState }) => (
								<FormItem hidden={isCreate === false} className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Category</FormLabel>
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
												options={categories}
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
							name="coverImgUrl"
							render={({ field, fieldState }) => (
								<FormItem hidden={true} className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">coverImgUrl</FormLabel>
									<div className="col-span-3">
										<FileUpload
											fileTypes={["image/jpeg", "image/png"]}
											uploadSucessFunc={(url: string) => {
												form.setValue("coverImgUrl", url);
											}}
										/>
										<FormControl>{<Input hidden={true} {...field} />}</FormControl>
										{fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
										<img alt="img" hidden={!field.value} className="h-20" src={field.value} />
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
					>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
