import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";

import menuService from "@/api/services/menuService";
import { MenuType, type MenusPermissionTree } from "@/types/loginEntity";
import type { Permission, Sys } from "@/types/systemEntity";
import type { ModalProps } from "@/types/types";
import { convertToMenuPermissionTree } from "@/utils/tree";
import { Select, TreeSelect } from "antd";
import { toast } from "sonner";

import permissionService from "@/api/services/permissionService";
import { type MenuFormData, menuFormSchema } from "@/schemas/menuSchema";
import { zodResolver } from "@hookform/resolvers/zod";
/*
interface MenuModalProps extends ModalProps<UserMenus> {
	systemOptions: Sys[];
}*/
const { SHOW_PARENT } = TreeSelect;

//只能接收一个对象
export function MenuModal({ title, show, formValue, id, onOk, onCancel, systemOptions }: ModalProps<MenuFormData> & { systemOptions: Sys[] }) {
	const isEdit = id !== "0";
	const [MenuTree, setMenuTree] = useState<MenusPermissionTree[]>([]);
	const [allPermissions, SetAllPermissions] = useState<Permission[]>([]);
	const [permissionListState, setPermissionListState] = useState<Permission[]>([]);

	const [checkedKey, setCheckedKey] = useState<string>("");

	useEffect(() => {
		permissionService
			.getlist()
			.then((data) => {
				SetAllPermissions(data);
			})
			.catch((err) => toast.error(`get permission list error,${err}`));
	}, []);

	const form = useForm<MenuFormData>({
		resolver: zodResolver(menuFormSchema),
		defaultValues: formValue,
	});

	//use unknown
	const handleOnTreechange = (item: string) => {
		console.log(item);
		setCheckedKey(item);
	};
	const onSubmit = async () => {
		let parentid = "0";
		if (checkedKey.startsWith("m_")) {
			parentid = checkedKey.replace("m_", "");
		}

		if (parentid === id && id !== "0") {
			toast.error("can not set this as its parent");
			return;
		}
		const model: MenuFormData = {
			...form.getValues(),
			parentId: parentid,
		};
		try {
			if (id === "0") {
				//new
				await menuService.create(model);
			} else {
				await menuService.update(id.toString(), model);
			}

			toast.success("operate success");
			onOk();
		} catch (error) {
			toast.error(`operation error,${error}`);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const permissions = allPermissions.filter((t) => t.systemName === formValue.systemName);

		setPermissionListState(permissions);

		const fetchMenus = async () => {
			try {
				//		const fetchedMenus = await menuService.getAllMenuList("");
				const fetchedMenus = await menuService.getAllMenuList(formValue.systemName);
				const tree = convertToMenuPermissionTree(fetchedMenus, false);

				setMenuTree(tree);
			} catch (error) {
				console.error("Failed to fetch menu data:");
			}
		};
		let key = `m_${formValue.parentId}`;
		if (key === "m_0") {
			key = `s_${formValue.systemName}`;
		}
		if (key === "m_") {
			key = "";
		}
		setCheckedKey(key);
		fetchMenus();

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
							defaultValue=""
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">System Name</FormLabel>
									<div className="col-span-3">
										<FormControl>
											<Select
												{...field}
												disabled={isEdit}
												fieldNames={{
													label: "systemName",
													value: "systemName",
												}}
												options={systemOptions}
												getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
												style={{ width: "100%" }}
												onChange={(value) => {
													field.onChange(value);
													const permissions = allPermissions.filter((t) => t.systemName === value);
													form.resetField("permissionIds");
													setPermissionListState(permissions);
												}}
											/>
										</FormControl>
										{fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="path"
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Path</FormLabel>
									<div className="col-span-3">
										<FormControl>{<Input {...field} />}</FormControl>
										{fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="component"
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Component</FormLabel>
									<div className="col-span-3">
										<FormControl>{<Input {...field} />}</FormControl>
										{fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
									</div>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="sort"
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Sort</FormLabel>
									<div className="col-span-3">
										<FormControl>{<Input type="number" {...field} />}</FormControl>
										{fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="type"
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Type</FormLabel>
									<div className="col-span-3">
										<FormControl>
											{
												<Select
													{...field}
													getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
													style={{ width: "100%" }}
													onChange={(value) => field.onChange(value)}
													options={[
														{ value: MenuType.Catelogue, label: "Catelogue" },
														{ value: MenuType.Menu, label: "Menu" },
													]}
												/>
											}
										</FormControl>
										{fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="parentId"
							render={({ fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Parent</FormLabel>
									<div className="col-span-3">
										<FormControl>
											<TreeSelect
												fieldNames={{
													label: "title",
													value: "id",
													children: "children",
												}}
												//treeCheckable
												showCheckedStrategy={SHOW_PARENT}
												treeData={MenuTree}
												value={checkedKey}
												treeCheckStrictly={true}
												treeDefaultExpandAll
												getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
												placeholder="Please select"
												style={{ width: "100%" }}
												onSelect={handleOnTreechange}
											/>
										</FormControl>
										{fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
									</div>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="permissionIds"
							render={({ field, fieldState }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Permissions</FormLabel>
									<div className="col-span-3">
										<FormControl>
											{
												<Select
													mode="multiple"
													value={field.value}
													getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
													style={{ width: "100%" }}
													fieldNames={{
														label: "title",
														value: "id",
													}}
													showSearch
													optionFilterProp="title"
													filterSort={(optionA, optionB) => (optionA?.title ?? "").toLowerCase().localeCompare((optionB?.title ?? "").toLowerCase())}
													onChange={(value) => field.onChange(value)}
													options={permissionListState}
												/>
											}
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
