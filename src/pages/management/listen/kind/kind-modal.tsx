import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";

import kindService from "@/api/services/kindService";
import { type KindFormData, kindFormSchema } from "@/schemas/kindSchema";

import { ImgUpload } from "@/mycomponent/ImgUpload";
import type { ModalProps } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

export function KindModal({ title, show, id, formValue, onOk, onCancel }: ModalProps<KindFormData>) {
	const form = useForm<KindFormData>({
		resolver: zodResolver(kindFormSchema),
		defaultValues: formValue,
	});

	const onSubmit = async () => {
		const model: KindFormData = form.getValues();

		try {
			if (id === "0") {
				//new
				await kindService.create(model);
			} else {
				await kindService.update(id.toString(), model);
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

	const onUploadSuccess = (url: string) => {
		console.log(url);

		form.setValue("coverImgUrl", url);
	};
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
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">sequenceNumber</FormLabel>
									<div className="col-span-3">
										<FormControl>{<Input type="number" {...field} />}</FormControl>
										{fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="coverImgUrl"
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">coverImgUrl</FormLabel>
									<div className="col-span-3">
										<ImgUpload uploadSucessFunc={onUploadSuccess} />
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
