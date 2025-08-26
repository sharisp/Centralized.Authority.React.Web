import { useUserPermissions } from "@/store/userStore";
import type { ReactNode } from "react";

export function Permission({ permissionKey, children }: { permissionKey: string; children: ReactNode }) {
	const permissions = useUserPermissions();

	if (permissionKey && permissions.includes(permissionKey)) {
		return children;
	}
	return null;
}
