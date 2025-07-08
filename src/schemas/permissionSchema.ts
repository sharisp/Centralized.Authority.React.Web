// schemas/userFormSchema.ts
import type { Permission } from "@/types/systemEntity";
import { z } from "zod";

export const permissionFormSchema = z.object({
	title: z.string().nonempty("title is required"),
	permissionKey: z.string().nonempty("permissionKey is required"),
	systemName: z.string().nonempty("systemName is required"),
});

export type PermissionFormData = z.infer<typeof permissionFormSchema>;

export function ConvertToFormData(info: Permission): PermissionFormData {
	return {
		title: info.title,
		permissionKey: info.permissionKey,
		systemName: info.systemName,
	};
}
