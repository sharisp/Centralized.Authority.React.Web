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
import { Permission, Sys } from "@/types/systemEntity";
import sysService from "@/api/services/sysService";
import permissionService from "@/api/services/permissionService";

const { SHOW_PARENT } = TreeSelect;
let allPermissions: Permission[] = []
export function MenuModal({ title, show, formValue, onOk, onCancel }: ModalProps<UserMenus>) {


	const [menuTypeVal, setMenuTypeVal] = useState<MenuType>(MenuType.Catelogue)
	const [MenuTree, setMenuTree] = useState<MenusPermissionTree[]>([]);

	const [systemListState, setSysListState] = useState<Sys[]>([])

	const [permissionListState, setPermissionListState] = useState<Permission[]>([])
	const [sysName, setSysName] = useState('')

	const [isCreate, setIsCreate] = useState(false)
	useEffect(
		() => {

			sysService.getlist().then(data => setSysListState(data))
				.catch(err => toast.error("get sys list error," + err))

			permissionService.getlist().then(data => allPermissions = data).catch(err => toast.error("get permission list error," + err))

		}, [])

	const form = useForm<UserMenus>({
		defaultValues: formValue,
	});

	const [checkedKey, setCheckedKey] = useState<string>("");
	const [checkedPermissionKeys, setCheckedPermissionKeys] = useState<string[]>([]);

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
		const model: UserMenus & { permissionIds: string[] } = {
			id: "",
			title: form.getValues().title,
			systemName: sysName,
			path: form.getValues().path,
			parentId: parentid,
			icon: form.getValues().icon,
			sort: form.getValues().sort,
			type: menuTypeVal,
			isShow: true,
			description: form.getValues().systemName,
			permissions: [],
			permissionIds: checkedPermissionKeys
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
	const handleSelectChange = (value: string) => {
		setSysName(value)
		const permissions = allPermissions.filter(t => t.systemName === value)
		setPermissionListState(permissions)
	}

	const handleChange = (value: MenuType) => {
		setMenuTypeVal(value)
	}
	const handlePermissionChange = (Values: string[]) => {
		console.log(Values)
		setCheckedPermissionKeys(Values)
	}
	useEffect(() => {
		setIsCreate(formValue.id === '')
		setMenuTypeVal(formValue.type)

		setSysName(String(formValue.systemName))
		const permissions = allPermissions.filter(t => t.systemName === formValue.systemName)

		setPermissionListState(permissions)
		if (formValue.permissions != null && formValue.permissions.length > 0) {

			setCheckedPermissionKeys(formValue.permissions.map(t => t.id))
		} else {
			setCheckedPermissionKeys([])
		}
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
		if (key === 'm_') {
			key = ''
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
							render={() => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">System Name</FormLabel>
									<div className="col-span-3">
										<FormControl>
											<Select
												value={sysName}
												disabled={(isCreate === false)}
												fieldNames={{
													label: 'systemName',
													value: 'systemName',
												}}
												options={systemListState}
												getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
												style={{ width: '100%' }}
												onChange={handleSelectChange}

											/>
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
						/>
						<FormField
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

						<FormField
							control={form.control}
							name="permissions"
							render={() => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Permissions</FormLabel>
									<div className="col-span-3">
										<FormControl>{
											<Select
												mode="multiple"
												defaultValue={checkedPermissionKeys}
												getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
												style={{ width: '100%' }}
												fieldNames={{
													label: 'title',
													value: 'id'
												}}
												showSearch
												optionFilterProp="title"
												filterSort={(optionA, optionB) =>
													(optionA?.title ?? '').toLowerCase().localeCompare((optionB?.title ?? '').toLowerCase())}
												onChange={handlePermissionChange}
												options={permissionListState}
											/>
										}</FormControl>
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
