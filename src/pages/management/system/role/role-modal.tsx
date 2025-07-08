import { TreeSelect } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";

import menuService from "@/api/services/menuService";
import roleService from "@/api/services/roleService";
import { type RoleFormData, roleFormSchema } from "@/schemas/roleFormSchema";
import type { MenusPermissionTree } from "@/types/loginEntity";
import type { ModalProps } from "@/types/types";
import { Textarea } from "@/ui/textarea";
import { convertToMenuPermissionTree } from "@/utils/tree";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const { SHOW_PARENT } = TreeSelect;
export function RoleModal({ title, show, id, formValue, onOk, onCancel }: ModalProps<RoleFormData>) {
	const [MenuTree, setMenuTree] = useState<MenusPermissionTree[]>([]);

	useEffect(() => {
		const fetchMenus = async () => {
			try {
				const fetchedMenusWithPermission = await menuService.getAllMenuListWithPermission("");
				const tree = convertToMenuPermissionTree(fetchedMenusWithPermission);

				setMenuTree(tree);
			} catch (error) {
				console.error(`Failed to fetch menu data:${error}`);
			}
		};

		fetchMenus();
	}, []);
	const form = useForm<RoleFormData>({
		resolver: zodResolver(roleFormSchema),
		defaultValues: formValue,
	});

	const onSubmit = async () => {
		console.log(form.getValues());
		const menuIds: string[] = [];
		const permissionIds: string[] = [];
		for (const key of checkedKeys) {
			console.log(key);
			if (key.startsWith("m_")) {
				menuIds.push(key.replace("m_", ""));
			} else if (key.startsWith("p_")) {
				permissionIds.push(key.replace("p_", ""));
			}
		}
		const role: RoleFormData = {
			...form.getValues(),
			permissionIds: permissionIds,
			menuIds: menuIds,
		};
		try {
			if (id === "0") {
				//new
				await roleService.create(role);
			} else {
				await roleService.update(id, role);
			}

			toast.success("operate success");
			onOk();
		} catch (error) {
			toast.error(`operate error,${error}`);
		}
	};
	const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

	//use unknown
	const handleOnchange = (values: unknown[]) => {
		const newCheckedKeys = values.map((item) => {
			if (typeof item === "object" && item !== null && "value" in item) {
				return String(item.value);
			}
			return String(item);
		});
		setCheckedKeys(newCheckedKeys);
	};
	useEffect(() => {
		//	const flattenedPermissions = flattenTrees(formValue.menus);
		const keys = (formValue.menuIds ?? []).map((item) => `m_${item}`);
		keys.push(...(formValue.permissionIds ?? []).map((item) => `p_${item}`));

		//keys.push('1388473344772280320')
		console.log(formValue);
		console.log(keys);
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
							name="roleName"
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Role Name</FormLabel>
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
							name="description"
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Description</FormLabel>
									<div className="col-span-3">
										<FormControl>{<Textarea {...field} value={field.value ?? ""} />}</FormControl>
										{fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="menuIds"
							render={({ fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Menus</FormLabel>
									<div className="col-span-3">
										<FormControl>
											<TreeSelect
												fieldNames={{
													label: "title",
													value: "id",
													children: "children",
												}}
												treeCheckable
												showCheckedStrategy={SHOW_PARENT}
												treeData={MenuTree}
												value={checkedKeys}
												treeCheckStrictly={true}
												treeDefaultExpandAll
												getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
												placeholder="Please select"
												style={{ width: "100%" }}
												onChange={handleOnchange}
											/>
										</FormControl>
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
