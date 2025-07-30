import { z } from "zod";

export const changePwdSchema = z
	.object({
		userName: z.string().nullable().optional(),
		oldPassword: z.string().min(5, "Password must be at least 5 characters").nonempty("OldPassword is required"),
		newPassword: z.string().min(5, "Password must be at least 5 characters").nonempty("newPassword is required"),
		confirmNewPassword: z.string().nonempty("OldPassword is required"),
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "newPassword and confirmNewPassword do not match",
		path: ["confirmNewPassword"],
	});

export type changePwdData = z.infer<typeof changePwdSchema>;
