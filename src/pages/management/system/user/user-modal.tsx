import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";

import roleService from "@/api/services/roleService";
import userService from "@/api/services/userService";
import { type UserFormData, userFormSchema } from "@/schemas/userFormSchema";
import type { Role } from "@/types/systemEntity";
import type { ModalProps, SelectOptionProps } from "@/types/types";
import { Select } from "antd";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
export function UserModal({ title, show, formValue, id, onOk, onCancel }: ModalProps<UserFormData>) {
	const [roleSelect, setRolesSelect] = useState<SelectOptionProps<string>[]>([]);
	useEffect(() => {
		const fetchRoles = async () => {
			try {
				const roles: Role[] = await roleService.getlist();

				const options: SelectOptionProps<string>[] = roles.map((t) => ({
					label: t.roleName,
					value: t.id,
				}));
				setRolesSelect(options);
			} catch (error) {
				toast.error(`fetch menu error,${error}`);
			}
		};

		fetchRoles();
	}, []);

	const form = useForm<UserFormData>({
		resolver: zodResolver(userFormSchema),
		defaultValues: formValue,
	});

	const onSubmit = async () => {
		const model = form.getValues();

		try {
			if (id === "0") {
				//new
				await userService.create(model);
			} else {
				await userService.update(id, model);
			}

			toast.success("operate success");
			onOk();
		} catch (error) {
			toast.error(`operate error,${error}`);
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
							name="userName"
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">User Name</FormLabel>
									<div className="col-span-3">
										<FormControl>
											<Input {...field} />
										</FormControl>
										{fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="realName"
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Real Name</FormLabel>
									<div className="col-span-3">
										<FormControl>{<Input {...field} value={field.value ?? ""} />}</FormControl>
										{fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="roleIds"
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Roles</FormLabel>
									<div className="col-span-3">
										<FormControl>
											<Select
												mode="multiple"
												allowClear
												style={{ width: "100%" }}
												placeholder="Please select"
												getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
												value={field.value ?? []}
												onChange={(value) => field.onChange(value)}
												onBlur={field.onBlur}
												options={roleSelect}
											/>
										</FormControl>
										{fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Email</FormLabel>
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
