import { useRouteStore } from "@/store/routerStore";
//import useUserStore from "@/store/userStore";
//import type { MenuMetaInfo } from "@/types/entity";
//import { DB_MENU } from "@/_mock/assets_backup";
//import type { MenuMetaInfo, MenuTree } from "@/types/entity";d
//import { PermissionType } from "@/types/enum";
import { MenuType, type MenusMetaInfo, type MenusTree } from "@/types/loginEntity";
import type { RouteObject } from "react-router";
import { Navigate } from "react-router";
import { Component } from "./utils";

/**
 * get route path from menu path and parent path
 * @param menuPath '/a/b/c'
 * @param parentPath '/a/b'
 * @returns '/c'
 *
 * @example
 * getRoutePath('/a/b/c', '/a/b') // '/c'
 */
const getRoutePath = (menuPath?: string, parentPath?: string) => {
	const menuPathArr = menuPath?.split("/").filter(Boolean) || [];
	const parentPathArr = parentPath?.split("/").filter(Boolean) || [];

	// remove parentPath items from menuPath
	const result = menuPathArr.slice(parentPathArr.length).join("/");
	return result;
};

/**
 * generate props for menu component
 * @param metaInfo
 * @returns
 */
const generateProps = (metaInfo: MenusMetaInfo) => {
	const props: any = {};
	if (metaInfo.externalLink) {
		props.src = metaInfo.externalLink?.toString() || "";
	}
	return props;
};

/**
 * convert menu to route
 * @param items
 * @param parent
 * @returns
 */
export const convertToRoute = (items: MenusTree[], parent?: MenusTree): RouteObject[] => {
	const routes: RouteObject[] = [];

	const processItem = (item: MenusTree) => {
		// if catalogue, process children
		if (item.type === MenuType.Catelogue) {
			const children = item.children || [];
			if (children.length > 0) {
				const firstChild = children[0];
				if (firstChild.path) {
					routes.push({
						path: getRoutePath(item.path, parent?.path),
						children: [
							{
								index: true,
								element: <Navigate to={getRoutePath(firstChild.path, item.path)} replace />,
							},
							...convertToRoute(children, item),
						],
					});
				}
			}
		}

		// if menu, create route
		if (item.type === MenuType.Menu) {
			const props = generateProps(item);

			routes.push({
				path: getRoutePath(item.path, parent?.path),
				element: Component(item.component, props),
			});
		}
	};

	for (const item of items) {
		processItem(item);
	}
	return routes;
};
export const getBackendDashboardRoutes = (): RouteObject[] => {
	const routes = convertToRoute(useRouteStore.getState().routes);
	return routes;
};
