import { LineLoading } from "@/components/loading";
import { GLOBAL_CONFIG } from "@/global-config";
import DashboardLayout from "@/layouts/dashboard";
import PageError from "@/pages/sys/error/PageError";
import { authRoutes } from "@/routes/sections/auth";
import { mainRoutes } from "@/routes/sections/main";
import { useRouteStore } from "@/store/routerStore";
// AppRouter.tsx
import { Suspense, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from "react-router";
import App from ".././App";
import LoginAuthGuard from "./components/login-auth-guard";
import { convertToRoute } from "./sections/dashboard/backend";

export default function AppRouter() {
	const menutree = useRouteStore((state) => state.routes);
	const dynamicRoutes = convertToRoute(menutree);

	const router = useMemo(() => {
		return createBrowserRouter(
			[
				{
					Component: () => (
						<App>
							<Outlet />
						</App>
					),
					errorElement: <ErrorBoundary fallbackRender={PageError} />,
					children: [
						/*		{
							path: "/",
							element: <Navigate to={GLOBAL_CONFIG.homepage} replace />,
						},*/
						...authRoutes,
						{
							element: (
								<LoginAuthGuard>
									<Suspense fallback={<LineLoading />}>
										<DashboardLayout menuTree={menutree} />
									</Suspense>
								</LoginAuthGuard>
							),
							children: [{ index: true, element: <Navigate to={GLOBAL_CONFIG.homepage} replace /> }, ...dynamicRoutes],
							//children: dynamicRoutes, // 后台返回的菜单路由
						},
						/*	{
							element: <Outlet />,
							children: dynamicRoutes, // 后台返回的菜单路由
						},*/
						...mainRoutes,
						{ path: "*", element: <Navigate to="/auth/login" replace /> },
					],
				},
			],
			{
				basename: GLOBAL_CONFIG.basePath,
			},
		);
	}, [dynamicRoutes, menutree]); // 👈 依赖变化时刷新 router

	return <RouterProvider router={router} />;
}
