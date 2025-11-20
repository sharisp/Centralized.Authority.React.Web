import { LineLoading } from "@/components/loading";
import { Suspense, lazy } from "react";
import { Outlet } from "react-router";
import type { RouteObject } from "react-router";

const LoginPage = lazy(() => import("@/pages/sys/login"));

const PageOAuth = lazy(() => import("@/pages/sys/login/oauth_auto_login"));
const authCustom: RouteObject[] = [
	{
		path: "login",
		element: <LoginPage />,
	},
];

export const authRoutes: RouteObject[] = [
	{
		path: "auth",
		element: (
			<Suspense fallback={<div>Loading...</div>}>
				<Outlet />
			</Suspense>
		),
		children: [...authCustom],
	},
	{
		path: "oauth",
		element: (
			<Suspense fallback={<LineLoading />}>
				<PageOAuth />
			</Suspense>
		),
	},
];
