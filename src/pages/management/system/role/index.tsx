import roleService from "@/api/services/roleService";
// import { ROLE_LIST } from "@/_mock/assets";
import { Icon } from "@/components/icon";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { useQuery } from "@tanstack/react-query";
import Table, { type ColumnsType } from "antd/es/table";
import { useState } from "react";
import type { Role } from "#/systemEntity";
import { RoleModal, type RoleModalProps } from "./role-modal";

// TODO: fix
// const ROLES: Role_Old[] = ROLE_LIST as Role_Old[];
const DEFAULE_ROLE_VALUE: Role = {
	id: 0,
	roleName: "",
	description: "",
	menus: [],
	permissions: [],
};
export default function RolePage() {
	const { data: roles = [], isLoading } = useQuery({ queryKey: ["roles"], queryFn: () => roleService.getlist() });

	const [roleModalPros, setRoleModalProps] = useState<RoleModalProps>({
		formValue: { ...DEFAULE_ROLE_VALUE },
		title: "New",
		show: false,
		onOk: () => {
			setRoleModalProps((prev) => ({ ...prev, show: false }));
		},
		onCancel: () => {
			setRoleModalProps((prev) => ({ ...prev, show: false }));
		},
	});
	const columns: ColumnsType<Role> = [
		{
			title: "Role Name",
			dataIndex: "roleName",
		},

		{ title: "Description", dataIndex: "description" },
		{
			title: "Action",
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-center text-gray">
					<Button variant="ghost" size="icon" onClick={() => onEdit(record)}>
						<Icon icon="solar:pen-bold-duotone" size={18} />
					</Button>
					<Button variant="ghost" size="icon">
						<Icon icon="mingcute:delete-2-fill" size={18} className="text-error!" />
					</Button>
				</div>
			),
		},
	];

	const onCreate = () => {
		setRoleModalProps((prev) => ({
			...prev,
			show: true,
			title: "Create New",
			formValue: {
				...prev.formValue,
				...DEFAULE_ROLE_VALUE,
			},
		}));
	};

	const onEdit = async (formValue: Role) => {
		//	// can not use useQuery hook,this is calling in another hook
		const detail = await roleService.getdetail(formValue.id);
		console.log(detail);
		setRoleModalProps((prev) => ({
			...prev,
			show: true,
			title: "Edit",
			formValue: {
				...prev.formValue,
				...detail,
			},
		}));
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>Role List</div>
					<Button onClick={onCreate}>New</Button>
				</div>
			</CardHeader>
			<CardContent>
				<Table<Role> rowKey="id" size="small" loading={isLoading} scroll={{ x: "max-content" }} pagination={false} columns={columns} dataSource={roles} />
			</CardContent>
			<RoleModal {...roleModalPros} />
		</Card>
	);
}
