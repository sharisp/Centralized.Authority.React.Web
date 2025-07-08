import PlaceholderImg from "@/assets/images/background/placeholder.svg";
import LocalePicker from "@/components/locale-picker";
import Logo from "@/components/logo";
import { GLOBAL_CONFIG } from "@/global-config";
import SettingButton from "@/layouts/components/setting-button";
import { useUserInfo, useUserToken } from "@/store/userStore";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import LoginForm from "./login-form";
import MobileForm from "./mobile-form";
import { LoginProvider } from "./providers/login-provider";
import QrCodeFrom from "./qrcode-form";
import RegisterForm from "./register-form";
import ResetForm from "./reset-form";

function LoginPage() {
	const token = useUserToken();

	const menus = useUserInfo().menus;
	const navigate = useNavigate();
	useEffect(() => {
		if (token.accessToken) {
			if (!menus || menus.length === 0) {
				toast.error("no permission menus for this account");
			} else {
				navigate(GLOBAL_CONFIG.homepage, { replace: true });
				//	return <Navigate to={GLOBAL_CONFIG.homepage} replace />;
			}
		}
	}, [token, menus, navigate]);

	return (
		<div className="relative grid min-h-svh lg:grid-cols-2 bg-background">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex justify-center gap-2 md:justify-start">
					<div className="flex items-center gap-2 font-medium cursor-pointer">
						<Logo size={28} />
						<span>{GLOBAL_CONFIG.appName}</span>
					</div>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs">
						<LoginProvider>
							<LoginForm />
							<MobileForm />
							<QrCodeFrom />
							<RegisterForm />
							<ResetForm />
						</LoginProvider>
					</div>
				</div>
			</div>

			<div className="relative hidden bg-background-paper lg:block">
				<img src={PlaceholderImg} alt="placeholder img" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5] dark:grayscale" />
			</div>

			<div className="absolute right-2 top-0 flex flex-row">
				<LocalePicker />
				<SettingButton />
			</div>
		</div>
	);
}
export default LoginPage;
