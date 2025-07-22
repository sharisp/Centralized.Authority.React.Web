import commonService from "@/api/services/commonService";
import Icon from "@/components/icon/icon";
import { Button } from "@/ui/button";
import { toast } from "sonner";

export function ConfirmOperate({
	hide,
	id,
	url,
	title,
	icon,
	setloading,
	callback,
}: {
	hide: boolean;
	id: string;
	url: string;
	title: string;
	icon: string;
	setloading?: (val: boolean) => void;
	callback: () => void;
}) {
	const onHandle = async () => {
		if (setloading) {
			setloading(true);
		}
		if (window.confirm(title)) {
			try {
				await commonService.handleput(id, url);
				toast.success("handle success");
			} catch (error) {
				toast.error(`handle error,${error}`);
			}
			callback();
		}
		if (setloading) {
			setloading(false);
		}
	};
	return (
		<Button hidden={hide} variant="ghost" size="icon" onClick={() => onHandle()}>
			<Icon icon={icon} size={18} />
		</Button>
	);
}
