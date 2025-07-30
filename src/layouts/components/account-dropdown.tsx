import { useLoginStateContext } from "@/pages/sys/login/providers/login-provider";
import { useRouter } from "@/routes/hooks";
import type { changePwdData } from "@/schemas/changepwdSchema";
import { useUserActions, useUserInfo } from "@/store/userStore";
import type { ModalProps } from "@/types/types";
import { Button } from "@/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/ui/dropdown-menu";
import { faker } from "@faker-js/faker";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChangePwdModal } from "./changpwdModal";

/**
 * Account Dropdown
 */
export default function AccountDropdown() {
	const { replace } = useRouter();
	const { userName, email } = useUserInfo();
	const { clearUserInfoAndToken } = useUserActions();
	const { backToLogin } = useLoginStateContext();
	const { t } = useTranslation();
	const logout = () => {
		try {
			clearUserInfoAndToken();
			backToLogin();
		} catch (error) {
			console.log(error);
		} finally {
			replace("/auth/login");
		}
	};

	const [modalPros, setModalProps] = useState<ModalProps<changePwdData>>({
		formValue: { userName: "", oldPassword: "", newPassword: "", confirmNewPassword: "" },
		title: "Change Password",
		id: "0",
		show: false,
		onOk: () => {
			setModalProps((prev) => ({ ...prev, show: false }));
		},
		onCancel: () => {
			setModalProps((prev) => ({ ...prev, show: false }));
		},
	});
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" className="rounded-full">
						<img className="h-6 w-6 rounded-full" src={faker.image.avatarGitHub()} alt="" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56">
					<div className="flex items-center gap-2 p-2">
						<img className="h-10 w-10 rounded-full" src={faker.image.avatarGitHub()} alt="" />
						<div className="flex flex-col items-start">
							<div className="text-text-primary text-sm font-medium">{userName}</div>
							<div className="text-text-secondary text-xs">{email}</div>
						</div>
					</div>

					<DropdownMenuSeparator />
					<DropdownMenuItem className="font-bold text-warning" onClick={() => setModalProps((prev) => ({ ...prev, show: true }))}>
						Change Password
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="font-bold text-warning" onClick={logout}>
						{t("sys.login.logout")}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<ChangePwdModal {...modalPros} />
		</>
	);
}
