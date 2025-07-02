import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";

import { toast } from "sonner";
import { ModalProps } from "@/types/types";
import { User } from "@/types/systemEntity";
import userService from "@/api/services/userService";

export function UserModal({ title, show, formValue, onOk, onCancel }: ModalProps<User>) {



	const form = useForm<User>({
		defaultValues: formValue,
	});

	const onSubmit = async () => {

		console.log(form.getValues());
		let roles: number[] = []

		for (const key of checkedKeys) {
			roles.push(key)
		}
		const model: User = {
			id: form.getValues().id, userName: form.getValues().userName,
			realName: form.getValues().realName,
			email: form.getValues().email,
			roles: []
		}
		try {
			if (model.id === 0) {
				//new
				await userService.create(model)

			} else {
				await userService.update(model)
			}

			toast.success("operate success")
			onOk()
		} catch {
			toast.error("operation error")
		}

	};
	const [checkedKeys, setCheckedKeys] = useState<number[]>([]);

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
									<FormLabel className="text-right">Menus</FormLabel>
									<div className="col-span-3">
										<FormControl>

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
