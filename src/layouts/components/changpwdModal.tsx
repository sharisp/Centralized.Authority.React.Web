import { useForm } from "react-hook-form";

import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";

import userService from "@/api/services/userService";
import type { ModalProps } from "@/types/types";
import { toast } from "sonner";

import { type changePwdData, changePwdSchema } from "@/schemas/changepwdSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

export function ChangePwdModal({ title, show, formValue, onOk, onCancel }: ModalProps<changePwdData>) {
	const form = useForm<changePwdData>({
		resolver: zodResolver(changePwdSchema),
		defaultValues: formValue,
	});
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		form.reset(formValue);
	}, [formValue, form, show]);

	const onSubmit = async () => {
		const model = form.getValues();

		try {
			await userService.changepwd(model);

			toast.success("chang password successfully");
			if (onOk) {
				onOk();
			}
		} catch (error) {
			toast.error(`operate error,${error}`);
		}
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
							name="oldPassword"
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Old Password</FormLabel>
									<div className="col-span-3">
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										{fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="newPassword"
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">New Password</FormLabel>
									<div className="col-span-3">
										<FormControl>{<Input type="password" {...field} value={field.value ?? ""} />}</FormControl>
										{fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmNewPassword"
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">ConfirmPassword</FormLabel>
									<div className="col-span-3">
										<FormControl>{<Input type="password" {...field} />}</FormControl>

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
