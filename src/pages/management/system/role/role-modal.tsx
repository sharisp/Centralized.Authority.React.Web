import { TreeSelect } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";

import menuService from "@/api/services/menuService";
import type { MenusTree, UserMenus } from "@/types/loginEntity";
import type { Role } from "@/types/systemEntity";
import { Textarea } from "@/ui/textarea";
import { convertFlatToTree } from "@/utils/tree";
function findNodeById(tree: MenusTree[], id: string): MenusTree | null {
	for (const node of tree) {
		if (node.id === id) return node;
		if (node.children) {
			const found = findNodeById(node.children, id);
			if (found) return found;
		}
	}
	return null;
}

export type RoleModalProps = {
	formValue: Role;
	title: string;
	show: boolean;
	onOk: VoidFunction;
	onCancel: VoidFunction;
};
const Menus: UserMenus[] = await menuService.getAllMenuList("");
const MenuTree: MenusTree[] = convertFlatToTree(Menus);
const { SHOW_PARENT } = TreeSelect;
export function RoleModal({ title, show, formValue, onOk, onCancel }: RoleModalProps) {
	const form = useForm<Role>({
		defaultValues: formValue,
	});

	const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

	useEffect(() => {
		//	const flattenedPermissions = flattenTrees(formValue.menus);

		setCheckedKeys(formValue.menus.map((item) => item.id));
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
												treeDefaultExpandAll
												getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
												placeholder="Please select"
												style={{ width: "100%" }}
												onChange={(values: string[]) => {
													setCheckedKeys(values);
													const selectedMenus = values.map((id) => findNodeById(MenuTree, id)).filter(Boolean) as UserMenus[];
													form.setValue("menus", selectedMenus);
												}}
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
							form.handleSubmit(onOk)();
						}}
					>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
