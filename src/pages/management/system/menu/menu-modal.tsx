import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";

import { toast } from "sonner";
import { ModalProps } from "@/types/types";
import { MenusPermissionTree, MenuType, UserMenus } from "@/types/loginEntity";
import menuService from "@/api/services/menuService";
import { Select, TreeSelect } from "antd";
import { convertToMenuPermissionTree } from "@/utils/tree";

const { SHOW_PARENT } = TreeSelect;
export function MenuModal({ title, show, formValue, onOk, onCancel }: ModalProps<UserMenus>) {


	const [menuTypeVal, setMenuTypeVal] = useState<MenuType>(MenuType.Catelogue)
	const [MenuTree, setMenuTree] = useState<MenusPermissionTree[]>([]);


	const form = useForm<UserMenus>({
		defaultValues: formValue,
	});

	const [checkedKey, setCheckedKey] = useState<string>("");

	//use unknown
	const handleOnTreechange = (item: string) => {
		console.log(item)
		setCheckedKey(item)
	}
	const onSubmit = async () => {

		let parentid: string = '0'
		if (checkedKey.startsWith('m_')) {
			parentid = checkedKey.replace('m_', '')
		}

		if (parentid == form.getValues().id) {
			toast.error("can not set this as its parent")
			return
		}
		const model: UserMenus = {
			id: "",
			title: form.getValues().title,
			systemName: form.getValues().systemName,
			path: form.getValues().path,
			parentId: parentid,
			icon: form.getValues().icon,
			sort: form.getValues().sort,
			type: menuTypeVal,
			isShow: true,
			description: form.getValues().systemName,
			permissions: [],


		}
		const id = form.getValues().id
		try {
			if (id === "0" || id === "") {
				//new
				await menuService.create(model)

			} else {
				await menuService.update(id, model)
			}

			toast.success("operate success")
			onOk()
		} catch {
			toast.error("operation error")
		}

	};

	const handleChange = (value: MenuType) => {
		setMenuTypeVal(value)
	}
	useEffect(() => {
		setMenuTypeVal(formValue.type)
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
		var key = 'm_' + formValue.parentId
		if (key === 'm_0') {
			key = 's_' + formValue.systemName
		}
		setCheckedKey(key)
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
							render={({ field }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">System Name</FormLabel>
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
							name="path"
							render={({ field }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Path</FormLabel>
									<div className="col-span-3">
										<FormControl>{<Input {...field} />}</FormControl>
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="component"
							render={({ field }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Component</FormLabel>
									<div className="col-span-3">
										<FormControl>{<Input {...field} />}</FormControl>
									</div>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="sort"
							render={({ field }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Sort</FormLabel>
									<div className="col-span-3">
										<FormControl>{<Input type="number" {...field} />}</FormControl>
									</div>
								</FormItem>
							)}
						/>	<FormField
							control={form.control}
							name="type"
							render={() => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Type</FormLabel>
									<div className="col-span-3">
										<FormControl>{
											<Select
												value={menuTypeVal}
												getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
												style={{ width: '100%' }}
												onChange={handleChange}
												options={[
													{ value: MenuType.Catelogue, label: 'Catelogue' },
													{ value: MenuType.Group, label: 'Group' },
													{ value: MenuType.Menu, label: 'Menu' },
												]}
											/>
										}</FormControl>
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="parentId"
							render={() => (
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
