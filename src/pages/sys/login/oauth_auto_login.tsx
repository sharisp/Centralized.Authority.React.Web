import { GLOBAL_CONFIG } from "@/global-config";
import { useOAuthSignIn } from "@/store/userStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function OAuthAutoLogin() {
	const navigate = useNavigate();
	const [msg, setMsg] = useState("login...");
	const signIn = useOAuthSignIn();
	useEffect(() => {
		async function handle() {
			const params = new URLSearchParams(window.location.search);
			const code = params.get("code");
			const state = params.get("state");

			const provider = params.get("provider");
			if (!code) {
				setMsg("Missing code, login failed.");
				return;
			}
			if (!provider) {
				setMsg("Missing provider, login failed.");
				return;
			}
			try {
				await signIn({ code: code, state: state, systemName: GLOBAL_CONFIG.systemName, provider: provider });
				setTimeout(() => {
					navigate(GLOBAL_CONFIG.homepage, { replace: true });
				}, 0);
				toast.success("Sign in success!", {
					closeButton: true,
				});
			} catch (err) {
				const message = err instanceof Error ? err.message : "Sign in fail!";
				toast.error(message, {
					closeButton: true,
				});
			}
		}

		handle();
	}, [navigate, signIn]);

	return <div>{msg}</div>;
}
