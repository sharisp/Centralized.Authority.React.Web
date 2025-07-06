import { TreeSelect } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";

import menuService from "@/api/services/menuService";
import roleService, { type RoleCreate } from "@/api/services/roleService";
import type { MenusPermissionTree } from "@/types/loginEntity";
import type { Role } from "@/types/systemEntity";
import type { ModalProps } from "@/types/types";
import { Textarea } from "@/ui/textarea";
import { convertToMenuPermissionTree } from "@/utils/tree";
import { toast } from "sonner";

const { SHOW_PARENT } = TreeSelect;
export function RoleModal({ title, show, formValue, onOk, onCancel }: ModalProps<Role>) {
	//const [Menus, setMenus] = useState<UserMenus[]>([]);
	//const [Menus1, setMenusWithPermission] = useState<UserMenus[]>([]);
	const [MenuTree, setMenuTree] = useState<MenusPermissionTree[]>([]);

	useEffect(() => {
		const fetchMenus = async () => {
			try {
				//		const fetchedMenus = await menuService.getAllMenuList("");
				const fetchedMenusWithPermission = await menuService.getAllMenuListWithPermission("");
				const tree = convertToMenuPermissionTree(fetchedMenusWithPermission);

				//	setMenus(fetchedMenus);
				//	setMenusWithPermission(fetchedMenusWithPermission);
				setMenuTree(tree);
			} catch (error) {
				console.error(`Failed to fetch menu data:${error}`);
			}
		};

		fetchMenus();
	}, []);
	const form = useForm<Role>({
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
		const role: RoleCreate = {
			id: form.getValues().id,
			roleName: form.getValues().roleName,
			description: form.getValues().description,
			menuIds: menuIds,
			permissionIds: permissionIds,
		};
		try {
			if (role.id === 0) {
				//new
				await roleService.create(role);
			} else {
				await roleService.update(role);
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
		const keys = formValue.menus.map((item) => `m_${item.id}`);
		keys.push(...formValue.permissions.map((item) => `p_${item.id}`));

		//keys.push('1388473344772280320')
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
							render={({ field }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Role Name</FormLabel>
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
							name="description"
							render={({ field }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Description</FormLabel>
									<div className="col-span-3">
										<FormControl>{<Textarea {...field} />}</FormControl>
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="menus"
							render={() => (
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
