import type { MenusTree } from "@/types/loginEntity";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface RouteTree {
	routes: MenusTree[];
	setRoutes: (routes: MenusTree[]) => void;
}

export const useRouteStore = create<RouteTree>()(
	persist(
		(set) => ({
			routes: [],
			setRoutes: (routes) => set({ routes }),
		}),
		{
			name: "routes", // 存储的 key
			storage: createJSONStorage(() => localStorage),
		},
	),
);
