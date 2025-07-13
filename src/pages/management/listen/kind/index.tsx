import kindService from "@/api/services/kindService";
import { Icon } from "@/components/icon";
import { ConvertToFormData, type KindFormData } from "@/schemas/kindSchema";
import type { Kind } from "@/types/listenEntity";
import type { ModalProps } from "@/types/types";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
//import { RoleModal, type RoleModalProps } from "./role-modal";
import { Col, Form, Input, Row, Space } from "antd";
import Table, { type ColumnsType } from "antd/es/table";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { PagenationParam } from "#/systemEntity";
import { KindModal } from "./kind-modal";

const DEFAULE_VALUE: KindFormData = {
	title: "",
	coverImgUrl: "",
	sequenceNumber: "1",
};

export default function KindPage() {
	const [isLoading, setIsLoading] = useState(false);

	const [paginationData, setPaginationData] = useState({
		dataList: [] as Kind[],
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
	}, []);

	const getList = async (queryPara: PagenationParam) => {
		setIsLoading(true);
		try {
			const data = await kindService.getpaginationlist(queryPara);
			setPaginationData({
				totalCount: data.totalCount,
				dataList: data.dataList,
			});
		} catch (error) {
			toast.error(`get detail error,${error}`);
		}

		setIsLoading(false);
	};
	const onDel = async (id: string) => {
		setIsLoading(true);
		if (window.confirm("are you sure to delete?")) {
			try {
				await kindService.del(id.toString());
				toast.success("delete success");
			} catch (error) {
				toast.error(`delete error,${error}`);
			}

			getList(queryStateRef.current);
		}
		setIsLoading(false);
	};

	//const { data: roles = [], isLoading } = useQuery({ queryKey: ["roles"], queryFn: () => roleService.getlist() });

	const [modalPros, setModalProps] = useState<ModalProps<KindFormData>>({
		formValue: { ...DEFAULE_VALUE },
		title: "New",
		id: "0",
		show: false,
		onOk: () => {
			//const latestQuery = { ...queryState };
			//	console.log("latest", latestQuery, queryStateRef.current)
			getList(queryStateRef.current);
			setModalProps((prev) => ({ ...prev, show: false }));
		},
		onCancel: () => {
			setModalProps((prev) => ({ ...prev, show: false }));
		},
	});
	const columns: ColumnsType<Kind> = [
		{ title: "Title", dataIndex: "title" },
		{ title: "sequenceNumber", dataIndex: "sequenceNumber", width: 150 },
		{ title: "coverImgUrl", dataIndex: "coverImgUrl" },
		// { title: "description", dataIndex: "description" },

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
			id: "0",
			show: true,
			title: "Create New",
			formValue: {
				...prev.formValue,
				...DEFAULE_VALUE,
			},
		}));
	};
	const onEdit = async (field: Kind) => {
		//	// can not use useQuery hook,this is calling in another hook
		try {
			const detail = await kindService.findById(field.id);
			const newfromValue = ConvertToFormData(detail);
			setModalProps((prev) => ({
				...prev,
				show: true,
				id: field.id,
				title: "Edit",
				formValue: {
					...prev.formValue,
					...newfromValue,
				},
			}));
		} catch (error) {
			toast.error(`get detail error:${error}`);
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
				<div style={{ width: "100%" }}>Kind List</div>
				<div className="items-center justify-between">
					<Form form={searchForm} name="advanced_search" style={formStyle} onFinish={onSearch}>
						<Row gutter={24}>
							{" "}
							<Col span={8} key={0}>
								<Form.Item label="Title" name="title">
									<Input placeholder="input title" />
								</Form.Item>
							</Col>{" "}
							<Col span={8} key={1} />{" "}
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
				<Table<Kind>
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
			<KindModal {...modalPros} />
		</Card>
	);
}
