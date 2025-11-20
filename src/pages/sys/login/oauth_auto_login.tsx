import { GLOBAL_CONFIG } from "@/global-config";
import { useOAuthSignIn } from "@/store/userStore";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoginPage from ".";

export default function OAuthAutoLogin() {
	//const [msg, setMsg] = useState("login...");
	const signIn = useOAuthSignIn();
	const [loading, setLoading] = useState(true);
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		async function handle() {
			const params = new URLSearchParams(window.location.search);
			const code = params.get("code");
			const state = params.get("state");

			const provider = params.get("provider");
			if (!code) {
				toast.error("Missing code, login failed!", {
					closeButton: true,
				});
				//setMsg("Missing code, login failed.");
				return;
			}
			if (!provider) {
				toast.error("Missing code, login failed!", {
					closeButton: true,
				});
				//setMsg("Missing provider, login failed.");
				return;
			}
			try {
				await signIn({ code: code, state: state, systemName: GLOBAL_CONFIG.systemName, provider: provider });
				const homepage = GLOBAL_CONFIG.homepage ?? "/";
				console.debug("HOME:", homepage, "CURRENT:", window.location.href);
				/*   setTimeout(() => {
						 navigate(GLOBAL_CONFIG.homepage, { replace: true });
					 }, 0);*/

				toast.success("Sign in success!", {
					closeButton: true,
				});
				window.history.replaceState({}, "", GLOBAL_CONFIG.homepage);
				window.location.replace(GLOBAL_CONFIG.homepage);
			} catch (err) {
				const message = err instanceof Error ? err.message : "Sign in fail!";
				console.error("OAuth Login Error:", err);
				console.log(message);
				toast.error("Sign in fail!", {
					closeButton: true,
				});
			} finally {
				setLoading(false);
			}
		}

		handle();
	}, []);

	return (
		<Spin spinning={loading}>
			<div>
				<LoginPage />
			</div>
		</Spin>
	);
}
