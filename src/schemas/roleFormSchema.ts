// schemas/userFormSchema.ts
import type { Role } from "@/types/systemEntity";
import { z } from "zod";

export const roleFormSchema = z.object({
	roleName: z.string().nonempty("Role name is required"),
	description: z.string().nullable().optional(),
	permissionIds: z.array(z.string()).optional(),
	menuIds: z.array(z.string()).optional(), //antd bug,must use string[]
});

export type RoleFormData = z.infer<typeof roleFormSchema>;

export function ConvertToFormData(info: Role): RoleFormData {
	return {
		roleName: info.roleName,
		description: info.description,
		permissionIds: info.permissions.map((t) => t.id.toString()),
		menuIds: info.menus.map((t) => t.id.toString()),
	};
}
