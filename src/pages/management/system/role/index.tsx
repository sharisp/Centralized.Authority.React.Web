import roleService from "@/api/services/roleService";
// import { ROLE_LIST } from "@/_mock/assets";
import { Icon } from "@/components/icon";
import { Permission } from "@/mycomponent/Permission";
import { ConvertToFormData, type RoleFormData } from "@/schemas/roleFormSchema";
import type { ModalProps } from "@/types/types";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { Col, Form, Input, Row, Space } from "antd";
import Table, { type ColumnsType } from "antd/es/table";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { PagenationParam, Role } from "#/systemEntity";
import { RoleModal } from "./role-modal";

const DEFAULE_ROLE_VALUE: RoleFormData = {
	roleName: "",
	description: "",
	menuIds: [],
	permissionIds: [],
};
export default function RolePage() {
	const [isLoading, setIsLoading] = useState(false);

	const [paginationData, setPaginationData] = useState({
		dataList: [] as Role[],
		totalCount: 0,
	});
	const [queryState, setQueryState] = useState<PagenationParam>({
		queryParams: {},
		pageIndex: 1,
		pageSize: 20,
	});

	const getList = async (queryPara: PagenationParam) => {
		setIsLoading(true);
		try {
			const data = await roleService.getpaginationlist(queryPara);
			setPaginationData({
				totalCount: data.totalCount,
				dataList: data.dataList,
			});
		} catch (error) {
			toast.error(`get list error,${error}`);
		}

		setIsLoading(false);
	};
	const queryStateRef = useRef(queryState);
	useEffect(() => {
		queryStateRef.current = queryState;
	}, [queryState]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		getList(queryState);
	}, []);

	//const { data: roles = [], isLoading } = useQuery({ queryKey: ["roles"], queryFn: () => roleService.getlist() });

	const onDel = async (id: string) => {
		setIsLoading(true);
		if (window.confirm("are you sure to delete?")) {
			try {
				await roleService.del(id);

				toast.success("delete success");
			} catch (error) {
				toast.error(`delete error,${error}`);
			}

			getList(queryStateRef.current);
		}
		setIsLoading(false);
	};
	const [roleModalPros, setRoleModalProps] = useState<ModalProps<RoleFormData>>({
		formValue: { ...DEFAULE_ROLE_VALUE },
		title: "New",
		id: "0",
		show: false,
		onOk: () => {
			getList(queryStateRef.current);
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
					<Permission permissionKey="Identity.Role.Update">
						<Button variant="ghost" size="icon" onClick={() => onEdit(record)}>
							<Icon icon="solar:pen-bold-duotone" size={18} />
						</Button>
					</Permission>
					<Permission permissionKey="Identity.Role.Delete">
						<Button variant="ghost" size="icon" onClick={() => onDel(record.id)}>
							<Icon icon="mingcute:delete-2-fill" size={18} className="text-error!" />
						</Button>
					</Permission>
				</div>
			),
		},
	];

	const [searchForm] = Form.useForm();
	const onCreate = () => {
		setRoleModalProps((prev) => ({
			...prev,
			show: true,
			id: "0",
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
		const newformValue = ConvertToFormData(detail);
		setRoleModalProps((prev) => ({
			...prev,
			show: true,
			id: formValue.id,
			title: "Edit",
			formValue: {
				...prev.formValue,
				...newformValue,
			},
		}));
	};
	const onSearch = () => {
		const formvalues = searchForm.getFieldsValue();
		const newQueryState = {
			...queryState,
			pageIndex: 1,
			queryParams: formvalues,
		};
		setQueryState(newQueryState);

		//pageindex, pagesize更新usestate是异步的，直接查询不行，或者传参 或者用useeffect跟踪这几个参数
		getList(newQueryState);
	};
	const onPageChange = (pagination: { current?: number; pageSize?: number }) => {
		const { current, pageSize } = pagination;

		const newQueryState = {
			...queryState,
			pageIndex: current ?? queryState.pageIndex,
			pageSize: pageSize ?? queryState.pageSize,
		};
		setQueryState(newQueryState);
		getList(newQueryState);
	};

	const formStyle: React.CSSProperties = {
		maxWidth: "none",
		padding: 24,
	};

	return (
		<Card>
			<CardHeader>
				<div style={{ width: "100%" }}>Role List</div>
				<div className="items-center justify-between">
					<Form form={searchForm} name="advanced_search" style={formStyle} onFinish={onSearch}>
						<Row gutter={24}>
							{" "}
							<Col span={8} key={1}>
								<Form.Item label="Role Name" name="roleName">
									<Input placeholder="input Role Name" />
								</Form.Item>
							</Col>{" "}
							<Col span={8} key={2}>
								<Form.Item label="Description" name="description">
									<Input placeholder="input description" />
								</Form.Item>
							</Col>
							<Col span={8} key={3}>
								<Space size="large">
									<Button type="submit">Search</Button>
									<Button
										type="button"
										onClick={() => {
											searchForm.resetFields();
										}}
									>
										Clear
									</Button>

									<Button type="button" onClick={onCreate}>
										New
									</Button>
								</Space>
							</Col>
						</Row>
					</Form>
				</div>
			</CardHeader>
			<CardContent>
				<Table<Role>
					rowKey="id"
					size="small"
					loading={isLoading}
					scroll={{ x: "max-content", y: 55 * 5 }}
					pagination={{
						total: paginationData.totalCount,
						position: ["bottomRight"],
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total) => `Total ${total} items`,
						current: queryState.pageIndex,
						pageSize: queryState.pageSize,
					}}
					columns={columns}
					dataSource={paginationData.dataList}
					onChange={onPageChange}
				/>
			</CardContent>
			<RoleModal {...roleModalPros} />
		</Card>
	);
}
