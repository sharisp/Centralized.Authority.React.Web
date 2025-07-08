// schemas/userFormSchema.ts
import type { UserMenus } from "@/types/loginEntity";
import { z } from "zod";

export const menuFormSchema = z.object({
	title: z.string().nonempty("Title is required"),
	path: z.string().optional(),
	parentId: z.string(),
	component: z.string().optional(),
	icon: z.string().optional(),
	sort: z.coerce.number().int(),
	type: z.number().int(),
	externalLink: z.string().url().optional(),
	systemName: z.string().nonempty("System name is required"),
	permissionIds: z.array(z.string()).optional(),
});

export type MenuFormData = z.infer<typeof menuFormSchema>;

export function ConvertToFormData(info: UserMenus): MenuFormData {
	return {
		title: info.title,
		path: info.path,
		parentId: info.parentId,
		component: info.component ?? "",
		icon: info.icon ?? "",
		sort: info.sort,
		type: info.type,
		externalLink: info.externalLink ? info.externalLink.toString() : undefined,
		systemName: info.systemName,
		permissionIds: info.permissions?.map((t) => t.id.toString()),
	};
}
