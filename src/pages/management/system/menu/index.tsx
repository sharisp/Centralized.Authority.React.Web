import menuService from "@/api/services/menuService";
import sysService from "@/api/services/sysService";
// import { ROLE_LIST } from "@/_mock/assets";
import { Icon } from "@/components/icon";
import { ConvertToFormData, type MenuFormData } from "@/schemas/menuSchema";
import { MenuType, type UserMenus } from "@/types/loginEntity";
import type { ModalProps } from "@/types/types";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
//import { RoleModal, type RoleModalProps } from "./role-modal";
import { Col, Form, Input, Row, Select, Space } from "antd";
import Table, { type ColumnsType } from "antd/es/table";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { PagenationParam, Sys } from "#/systemEntity";

import { Permission } from "@/mycomponent/Permission";
import { MenuModal } from "./menu-modal";

const DEFAULE_VALUE: MenuFormData = {
	title: "",
	path: "",
	parentId: "",
	icon: "",
	sort: 0,
	component: "",
	type: MenuType.Catelogue,
	permissionIds: [],
	systemName: "",
};

export default function menuPage() {
	const [isLoading, setIsLoading] = useState(false);

	const [systemListState, setSysListState] = useState<Sys[]>([]);

	const [paginationData, setPaginationData] = useState({
		dataList: [] as UserMenus[],
		totalCount: 0,
	});
	const [queryState, setQueryState] = useState<PagenationParam>({
		queryParams: {},
		pageIndex: 1,
		pageSize: 20,
	});

	const queryStateRef = useRef(queryState);
	useEffect(() => {
		queryStateRef.current = queryState;
	}, [queryState]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		getList(queryState);
		sysService
			.getlist()
			.then((data) => setSysListState(data))
			.catch((err) => toast.error(`get sys list error,${err}`));
	}, []);

	const getList = async (queryPara: PagenationParam) => {
		setIsLoading(true);
		try {
			const data = await menuService.getpaginationlist(queryPara);
			setPaginationData({
				totalCount: data.totalCount,
				dataList: data.dataList,
			});
		} catch {
			toast.error("get list error");
		}

		setIsLoading(false);
	};
	const onDel = async (id: string) => {
		setIsLoading(true);
		if (window.confirm("are you sure to delete?")) {
			try {
				await menuService.del(id);
				toast.success("delete success");
			} catch (error) {
				toast.error(`delete error,${error}`);
			}

			getList(queryStateRef.current);
		}
		setIsLoading(false);
	};

	//const { data: roles = [], isLoading } = useQuery({ queryKey: ["roles"], queryFn: () => roleService.getlist() });

	const [modalPros, setModalProps] = useState<ModalProps<MenuFormData>>({
		formValue: { ...DEFAULE_VALUE },
		title: "New",
		id: "0",
		show: false,
		onOk: () => {
			getList(queryStateRef.current);
			setModalProps((prev) => ({ ...prev, show: false }));
		},
		onCancel: () => {
			setModalProps((prev) => ({ ...prev, show: false }));
		},
	});
	const columns: ColumnsType<UserMenus> = [
		{
			title: "SystemName",
			dataIndex: "systemName",
		},
		{ title: "Title", dataIndex: "title" },
		{
			title: "Type",
			dataIndex: "type",
			render: (value: MenuType) => <p>{MenuType[value]}</p>,
		},
		{ title: "Component", dataIndex: "component" },
		{ title: "Path", dataIndex: "path" },
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
					<Button variant="ghost" size="icon" onClick={() => onDel(record.id)}>
						<Icon icon="mingcute:delete-2-fill" size={18} className="text-error!" />
					</Button>
				</div>
			),
		},
	];

	const [searchForm] = Form.useForm();
	const onCreate = () => {
		setModalProps((prev) => ({
			...prev,
			show: true,
			id: "0",
			title: "Create New",
			formValue: {
				...prev.formValue,
				...DEFAULE_VALUE,
			},
		}));
	};
	const onEdit = async (formValue: UserMenus) => {
		//	// can not use useQuery hook,this is calling in another hook
		try {
			const detail = await menuService.findById(formValue.id);
			const newformValue = ConvertToFormData(detail);
			setModalProps((prev) => ({
				...prev,
				show: true,
				id: formValue.id,
				title: "Edit",
				formValue: {
					...prev.formValue,
					...newformValue,
				},
			}));
		} catch (error) {
			toast.error("get detail error");
		}
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

		//pageindex, pagesize更新usestate是异步的，直接查询不行，或者传参 或者用useeffect跟踪这几个参数
		getList(newQueryState);
	};

	const formStyle: React.CSSProperties = {
		maxWidth: "none",
		padding: 24,
	};

	return (
		<Card>
			<CardHeader>
				<div style={{ width: "100%" }}>UserMenus List</div>
				<div className="items-center justify-between">
					<Form form={searchForm} name="advanced_search" style={formStyle} onFinish={onSearch}>
						<Row gutter={24}>
							{" "}
							<Col span={8} key={1}>
								<Form.Item label="Title" name="title">
									<Input placeholder="input title" />
								</Form.Item>
							</Col>{" "}
							<Col span={8} key={2}>
								<Form.Item label="SystemName" name="systemName">
									<Select
										placeholder="Select SystemName"
										options={systemListState}
										fieldNames={{
											label: "systemName",
											value: "systemName",
										}}
										allowClear
									/>
								</Form.Item>
							</Col>
							<Col span={8} key={3}>
								<Space size="large">
									<Permission permissionKey="Identity.Menu.List">
										<Button type="submit">Search</Button>
									</Permission>
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
				<Table<UserMenus>
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
			<MenuModal systemOptions={systemListState} {...modalPros} />
		</Card>
	);
}
