import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";

import { toast } from "sonner";
import { ModalProps, SelectOptionProps } from "@/types/types";
import { Role, User } from "@/types/systemEntity";
import userService, { UserCreate } from "@/api/services/userService";
import roleService from "@/api/services/roleService";
import { Select } from "antd";

export function UserModal({ title, show, formValue, onOk, onCancel }: ModalProps<User>) {

	const [roleSelect, setRolesSelect] = useState<SelectOptionProps<number>[]>([])
	useEffect(() => {
		const fetchRoles = async () => {
			try {
				const roles: Role[] = await roleService.getlist();

				const options: SelectOptionProps<number>[] = roles.map(t => ({
					label: t.roleName,
					value: t.id
				}))
				setRolesSelect(options);
			} catch (error) {
				console.error("Failed to fetch menu data:");
			}
		};

		fetchRoles();
	}, []);

	const form = useForm<User>({
		defaultValues: formValue,
	});

	const onSubmit = async () => {

		console.log(form.getValues());
		let roles: number[] = []

		for (const key of checkedKeys) {
			roles.push(key)
		}
		const model: UserCreate = {
			//
			userName: form.getValues().userName,
			realName: form.getValues().realName,
			email: form.getValues().email,
			roleIds: checkedKeys
		}
		const id = form.getValues().id
		try {
			if (id === 0) {
				//new
				await userService.create(model)

			} else {
				await userService.update(id, model)
			}

			toast.success("operate success")
			onOk()
		} catch {
			toast.error("operation error")
		}

	};
	const [checkedKeys, setCheckedKeys] = useState<number[]>([]);
	const handleChange = (value: number[]) => {
		//	console.log(value)
		setCheckedKeys(value);
	}
	//use unknown
	useEffect(() => {
		var keys = formValue.roles.map((item) => item.id);

		setCheckedKeys(keys);
	}, [formValue]);

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
							render={({ field }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">User Name</FormLabel>
									<div className="col-span-3">
										<FormControl>
											<Input {...field} />
										</FormControl>
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="realName"
							render={({ field }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Real Name</FormLabel>
									<div className="col-span-3">
										<FormControl>{<Input {...field} />}</FormControl>
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Email</FormLabel>
									<div className="col-span-3">
										<FormControl>{<Input {...field} />}</FormControl>
									</div>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="roles"
							render={() => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Roles</FormLabel>
									<div className="col-span-3">
										<FormControl>
											<Select
												mode="multiple"
												allowClear
												style={{ width: '100%' }}
												placeholder="Please select"
												getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
												defaultValue={checkedKeys}
												onChange={handleChange}
												options={roleSelect}
											/>
										</FormControl>
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
