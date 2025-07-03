import { MenusPermissionTree, MenuType, UserMenus } from "@/types/loginEntity";
import { chain } from "ramda";

/**
 * Flatten an array containing a tree structure
 * @param {T[]} trees - An array containing a tree structure
 * @returns {T[]} - Flattened array
 */
export function flattenTrees<T extends { children?: T[] }>(trees: T[] = []): T[] {
	return chain((node) => {
		const children = node.children || [];
		return [node, ...flattenTrees(children)];
	}, trees);
}

/**
 * Convert an array to a tree structure
 * @param items - An array of items
 * @returns A tree structure
 */
export function convertToTree<T extends { children?: T[] }>(items: T[]): T[] {
	console.log(items);
	const tree = items.map((item) => ({ ...item, children: convertToTree(item.children || []) }));
	console.log(tree);
	return tree;
}

/**
 * Convert a flat array with parentId to a tree structure
 * @param items - An array of items with parentId
 * @returns A tree structure with children property
 */
export function convertFlatToTree<T extends { id: string; parentId: string }>(items: T[]): (T & { children: T[] })[] {
	console.log("items", items);
	const itemMap = new Map<string, T & { children: T[] }>();
	const result: (T & { children: T[] })[] = [];

	// First pass: create a map of all items
	for (const item of items) {
		itemMap.set(item.id, { ...item, children: [] });
	}
	// Second pass: build the tree
	for (const item of items) {
		const node = itemMap.get(item.id);
		//console.log(node);
		if (!node) continue;
		if (item.parentId === '0' || item.parentId === '') {
			result.push(node);
		} else {
			const parent = itemMap.get(item.parentId);
			if (parent) {
				parent.children.push(node);
			}
		}
	}
	console.log(result);
	return result;
}

export function convertToMenuPermissionTree(items: UserMenus[], containMenu: boolean = true): MenusPermissionTree[] {

	const itemMap = new Map<string, MenusPermissionTree>();
	const result: MenusPermissionTree[] = [];

	for (const item of items) {
		if (item.parentId === '0' && item.systemName !== "") {
			//system group
			itemMap.set("s_" + item.systemName, { id: "s_" + item.systemName, title: item.systemName, parentId: "s_none", menuType: MenuType.Group, children: [] });
			//
			itemMap.set("m_" + item.id, { id: "m_" + item.id, title: item.title, parentId: "s_" + item.systemName, menuType: item.type, children: [] });

		} else {
			if (!(containMenu === false && item.type === MenuType.Menu)) {
				itemMap.set("m_" + item.id, { id: "m_" + item.id, title: item.title, parentId: "m_" + item.parentId, menuType: item.type, children: [] });

			}

		}
		if (item.type === MenuType.Menu && item.permissions != null) {
			for (const element of item.permissions) {
				itemMap.set("p_" + element.id, { id: "p_" + element.id, title: element.title, parentId: "m_" + item.id, menuType: MenuType.Permission, children: [] });

			}
		}
	}
	// Second pass: build the tree
	for (const item of itemMap.values()) {
		const node = itemMap.get(item.id);
		//console.log(node);
		if (!node) continue;
		if (item.parentId === 's_none') {
			result.push(node);
		} else {
			const parent = itemMap.get(item.parentId);
			if (parent) {
				if (parent.children == null) {
					parent.children = []
				}
				parent.children.push(node);
			}
		}
	}
	console.log(result);
	return result;
}

