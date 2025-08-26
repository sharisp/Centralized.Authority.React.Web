import packageJson from "../package.json";

export type GlobalConfig = {
	appName: string;
	systemName: string;
	appVersion: string;
	homepage: string;
	basePath: string;
	baseApi: string;
	routerMode: "frontend" | "backend";
	buttonPermission: boolean;
};

export const GLOBAL_CONFIG: GlobalConfig = {
	appName: import.meta.env.VITE_APP_NAME,
	systemName: import.meta.env.VITE_APP_SystemName,
	appVersion: packageJson.version,
	homepage: import.meta.env.VITE_APP_HOMEPAGE || "/",
	basePath: import.meta.env.VITE_APP_BASE_PATH || "/",
	baseApi: import.meta.env.VITE_APP_BASE_API || "/api",
	routerMode: import.meta.env.VITE_APP_ROUTER_MODE || "frontend",
	buttonPermission: import.meta.env.VITE_APP_BUTTON_PERMISSION === "true",
};
