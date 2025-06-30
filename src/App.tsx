import Logo from "@/assets/images/logo.png";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { MotionLazy } from "./components/animate/motion-lazy";
import { RouteLoadingProgress } from "./components/loading";
import Toast from "./components/toast";
import { GLOBAL_CONFIG } from "./global-config";
import { AntdAdapter } from "./theme/adapter/antd.adapter";
import { ThemeProvider } from "./theme/theme-provider";

if (import.meta.env.DEV) {
	import("react-scan").then(({ scan }) => {
		scan({
			enabled: false,
			showToolbar: true,
			log: false,
			animationSpeed: "fast",
		});
	});
}

function App({ children }: { children: React.ReactNode }) {
	/*const userinfo = useUserInfo();
	let menus = userinfo?.menus ?? [];
	console.log(userinfo);
	const setUserMenus = useUserActions().setUserMenus;

	useEffect(() => {
		if (menus.length === 0) {
			//	menus = await menuService.getUserMenuList("Identity");
			menuService
				.getUserMenuList(GLOBAL_CONFIG.systemName)
				.then((data) => {
					menus = data;
					setUserMenus(data);
				})
				.catch((e) => console.log(e));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [menus.length, setUserMenus]);*/
	return (
		<HelmetProvider>
			<QueryClientProvider client={new QueryClient()}>
				<ThemeProvider adapters={[AntdAdapter]}>
					<VercelAnalytics debug={import.meta.env.PROD} />
					<Helmet>
						<title>{GLOBAL_CONFIG.appName}</title>
						<link rel="icon" href={Logo} />
					</Helmet>
					<Toast />
					<RouteLoadingProgress />
					<MotionLazy>{children}</MotionLazy>
				</ThemeProvider>
			</QueryClientProvider>
		</HelmetProvider>
	);
}

export default App;
