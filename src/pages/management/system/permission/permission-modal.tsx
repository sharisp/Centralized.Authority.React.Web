import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";

import permissionService from "@/api/services/permissionService";
import sysService from "@/api/services/sysService";
import { type PermissionFormData, permissionFormSchema } from "@/schemas/permissionSchema";
import type { Sys } from "@/types/systemEntity";
import type { ModalProps } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "antd";
import { toast } from "sonner";

export function PermissionModal({ title, show, id, formValue, onOk, onCancel }: ModalProps<PermissionFormData>) {
	const [systemListState, setSysListState] = useState<Sys[]>([]);

	useEffect(() => {
		sysService
			.getlist()
			.then((data) => setSysListState(data))
			.catch((err) => toast.error(`get sys list error,${err}`));
	}, []);
	const form = useForm<PermissionFormData>({
		resolver: zodResolver(permissionFormSchema),
		defaultValues: formValue,
	});

	const onSubmit = async () => {
		const model: PermissionFormData = form.getValues();

		try {
			if (id === "0") {
				//new
				await permissionService.create(model);
			} else {
				await permissionService.update(id.toString(), model);
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
							name="systemName"
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">System Name</FormLabel>
									<div className="col-span-3">
										<FormControl>
											<Select
												{...field}
												fieldNames={{
													label: "systemName",
													value: "systemName",
												}}
												options={systemListState}
												getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
												style={{ width: "100%" }}
												onChange={(value) => field.onChange(value)}
											/>
										</FormControl>
										{fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="permissionKey"
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">PermissionKey</FormLabel>
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
					>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
