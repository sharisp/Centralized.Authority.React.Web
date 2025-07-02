export type ModalProps<T> = {
  formValue: T;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
};