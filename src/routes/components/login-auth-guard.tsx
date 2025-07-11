import { useUserInfo, useUserToken } from "@/store/userStore";
import { useCallback, useEffect } from "react";
import { useRouter } from "../hooks";

type Props = {
	children: React.ReactNode;
};
export default function LoginAuthGuard({ children }: Props) {
	const router = useRouter();
	const { accessToken } = useUserToken();
	console.log(accessToken);

	const info = useUserInfo();
	console.log(info);
	const check = useCallback(() => {
		if (!accessToken) {
			router.replace("/auth/login");
		}
	}, [router, accessToken]);

	useEffect(() => {
		check();
	}, [check]);

	return <>{children}</>;
}
