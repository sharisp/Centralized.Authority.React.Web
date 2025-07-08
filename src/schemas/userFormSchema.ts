// schemas/userFormSchema.ts
import type { User } from "@/types/systemEntity";
import { z } from "zod";

export const userFormSchema = z.object({
	userName: z.string().nonempty("User name is required"),
	realName: z.string().nullable().optional(),
	email: z
		.string()
		.nonempty("email is needed")
		.refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
			message: "Invalid email format",
		}),
	roleIds: z.array(z.string()).min(1, "at least one role"), //antd bug,must use string[]
});

export type UserFormData = z.infer<typeof userFormSchema>;

export function ConvertToUserFormData(user: User): UserFormData {
	const roleIds: string[] = user.roles.map((t) => t.id.toString());
	console.log(roleIds);
	return {
		userName: user.userName,
		realName: user.realName,
		email: user.email,
		roleIds: roleIds,
	};
}
