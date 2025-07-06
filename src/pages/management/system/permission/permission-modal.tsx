import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";

import permissionService from "@/api/services/permissionService";
import sysService from "@/api/services/sysService";
import type { Permission, Sys } from "@/types/systemEntity";
import type { ModalProps } from "@/types/types";
import { Select } from "antd";
import { toast } from "sonner";

export function PermissionModal({ title, show, formValue, onOk, onCancel }: ModalProps<Permission>) {
	const [systemListState, setSysListState] = useState<Sys[]>([]);
	const [sysName, setSysName] = useState("");
	useEffect(() => {
		sysService
			.getlist()
			.then((data) => setSysListState(data))
			.catch((err) => toast.error(`get sys list error,${err}`));
	}, []);
	const form = useForm<Permission>({
		defaultValues: formValue,
	});

	const onSubmit = async () => {
		const model: Permission = {
			id: "",
			title: form.getValues().title,
			permissionKey: form.getValues().permissionKey,
			systemName: sysName,
		};
		const id = form.getValues().id;
		try {
			if (id === "0" || id === "") {
				//new
				await permissionService.create(model);
			} else {
				await permissionService.update(id, model);
			}

			toast.success("operate success");
			onOk();
		} catch (error) {
			toast.error(`operation error,${error}`);
		}
	};

	const handleSelectChange = (value: string) => {
		setSysName(value);
	};
	useEffect(() => {
		form.reset(formValue);
		setSysName(String(formValue.systemName));
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
							render={({ field }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Title</FormLabel>
									<div className="col-span-3">
										<FormControl>{<Input {...field} />}</FormControl>
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="systemName"
							render={() => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">System Name</FormLabel>
									<div className="col-span-3">
										<FormControl>
											<Select
												value={sysName}
												fieldNames={{
													label: "systemName",
													value: "systemName",
												}}
												options={systemListState}
												getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
												style={{ width: "100%" }}
												onChange={handleSelectChange}
											/>
										</FormControl>
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="permissionKey"
							render={({ field }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">PermissionKey</FormLabel>
									<div className="col-span-3">
										<FormControl>{<Input {...field} />}</FormControl>
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
