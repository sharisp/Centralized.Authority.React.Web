export type ModalProps<T> = {
	formValue: T;
	title: string;
	show: boolean;
	id: string;
	onOk: VoidFunction;
	onCancel: VoidFunction;
};

export type SelectOptionProps<T> = {
	label: string;
	value: T;
};
