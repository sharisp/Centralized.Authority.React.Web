import { GLOBAL_CONFIG } from "@/global-config";
import { useUserPermissions } from "@/store/userStore";
import type { ReactNode } from "react";

export function Permission({ permissionKey, children }: { permissionKey: string; children: ReactNode }) {
	if (GLOBAL_CONFIG.enableButtonPermission === false) {
		return children;
	}
	const permissions = useUserPermissions();
	//console.log(permissionKey);
	if (permissionKey && permissions.includes(permissionKey)) {
		return children;
	}
	return null;
}
