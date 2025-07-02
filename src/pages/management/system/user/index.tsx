// import { ROLE_LIST } from "@/_mock/assets";
import { Icon } from "@/components/icon";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
import Table, { type ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import type { PagenationParam, User } from "#/systemEntity";
//import { RoleModal, type RoleModalProps } from "./role-modal";
import { Col, Form, Input, Row, Space } from "antd";
import { toast } from "sonner";
import userService from "@/api/services/userService";
import { ModalProps } from "@/types/types";
import { UserModal } from "./user-modal";

const DEFAULE_VALUE: User = {
	id: 0,
	userName: "",
	realName: "",
	email: "",
	roles: [],
};

export default function UserPage() {

	const [isLoading, setIsLoading] = useState(false)

	const [paginationData, setPaginationData] = useState({
		dataList: [] as User[],
		totalCount: 0,
	})
	const [queryState, setQueryState] = useState<PagenationParam>({
		queryParams: {},
		pageIndex: 1,
		pageSize: 20,
	});


	const getList = async () => {
		setIsLoading(true)
		try {
			const data = await userService.getpaginationlist(queryState)
			setPaginationData({
				totalCount: data.totalCount,
				dataList: data.dataList

			})
		} catch {
			toast.error("get list error")
		}

		setIsLoading(false)
	}


	//const { data: roles = [], isLoading } = useQuery({ queryKey: ["roles"], queryFn: () => roleService.getlist() });

	const [modalPros, setModalProps] = useState<ModalProps<User>>({
		formValue: { ...DEFAULE_VALUE },
		title: "New",
		show: false,
		onOk: () => {
			getList()
			setModalProps((prev) => ({ ...prev, show: false }));

		},
		onCancel: () => {
			setModalProps((prev) => ({ ...prev, show: false }));
		},
	});
	const columns: ColumnsType<User> = [
		{
			title: "User Name",
			dataIndex: "userName",
		},

		{ title: "Email", dataIndex: "email" },
		{ title: "Real Name", dataIndex: "realName" },
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
	useEffect(() => {
		console.log(queryState)
		getList()
	}
		, [queryState])
	const [searchForm] = Form.useForm();
	const onCreate = () => {
		setModalProps((prev) => ({
			...prev,
			show: true,
			title: "Create New",
			formValue: {
				...prev.formValue,
				...DEFAULE_VALUE,
			},
		}));
	};
	const onEdit = async (formValue: User) => {
		//	// can not use useQuery hook,this is calling in another hook
		try {
			const detail = await userService.findById(formValue.id);

			setModalProps((prev) => ({
				...prev,
				show: true,
				title: "Edit",
				formValue: {
					...prev.formValue,
					...detail,
				},
			}));
		} catch (error) {
			toast.error("get detail error")
		}

	};
	const onSearch = () => {

		const formvalues = searchForm.getFieldsValue()

		setQueryState(prev => ({
			...prev,
			pageIndex: 1,
			queryParams: formvalues,
		}))

		//pageindex, pagesize更新usestate是异步的，直接查询不行，或者传参 或者用useeffect跟踪这几个参数
		//getList()
	}
	const onPageChange = (pagination: { current?: number; pageSize?: number }) => {

		const { current, pageSize } = pagination
		setQueryState(prev => ({
			...prev,
			pageIndex: current ?? prev.pageIndex,
			pageSize: pageSize ?? prev.pageSize,
		}));
		//getList()
	}

	const formStyle: React.CSSProperties = {
		maxWidth: 'none',
		padding: 24,
	};

	return (
		<Card>
			<CardHeader>
				<div style={{ width: '100%' }}>Role List</div>
				<div className="items-center justify-between">
					<Form form={searchForm} name="advanced_search" style={formStyle} onFinish={onSearch}>
						<Row gutter={24}>	<Col span={8} key={1}>
							<Form.Item label="User Name" name="userName">
								<Input placeholder="input User Name" />
							</Form.Item>
						</Col>		<Col span={8} key={2}>
								<Form.Item label="phone Number" name="phoneNumber">
									<Input placeholder="input phone Number" />
								</Form.Item>
							</Col>
							<Col span={8} key={3}>
								<Space size="large">
									<Button type="submit">
										Search
									</Button>
									<Button type="button"
										onClick={() => {
											searchForm.resetFields();
										}}
									>
										Clear
									</Button>

									<Button type="button" onClick={onCreate}>New</Button>
								</Space>

							</Col>
						</Row>

					</Form>
				</div>
			</CardHeader>
			<CardContent>
				<Table<User> rowKey="id" size="small" loading={isLoading} scroll={{ x: 'max-content', y: 55 * 5 }}
					pagination={{
						total: paginationData.totalCount, position: ['bottomRight'], showSizeChanger: true, showQuickJumper: true,
						showTotal: (total) => `Total ${total} items`
					}} columns={columns} dataSource={paginationData.dataList} onChange={onPageChange} />

			</CardContent>
			<UserModal {...modalPros} />
		</Card >
	);
}
