import "@testing-library/jest-dom";
import LoginForm from "@/pages/sys/login/login-form";

import { useSignIn } from "@/store/userStore";
//import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
//import { MemoryRouter } from "react-router";
import { useNavigate } from "react-router";
import { toast } from "sonner";
// LoginForm.test.tsx
jest.mock("@/global-config", () => ({
	GLOBAL_CONFIG: {
		appName: "React App",
		systemName: "React System",
		appVersion: "1.0.0",
		homepage: "/",
		basePath: "/",
		baseApi: "/api",
		routerMode: "frontend",
		enableButtonPermission: true,
	},
}));

// ✅ mock 外部依赖
jest.mock("sonner", () => ({
	toast: {
		success: jest.fn(),
		error: jest.fn(),
	},
}));

jest.mock("react-router", () => ({
	useNavigate: jest.fn(),
}));

jest.mock("@/store/userStore", () => ({
	useSignIn: jest.fn(),
}));

describe("LoginForm", () => {
	const mockNavigate = jest.fn();
	const mockSignIn = jest.fn();

	beforeEach(() => {
		(useNavigate as jest.Mock).mockReturnValue(mockNavigate);
		(useSignIn as jest.Mock).mockReturnValue(mockSignIn);
		jest.clearAllMocks();
	});

	test("calls signIn and navigate on success", async () => {
		mockSignIn.mockResolvedValueOnce({}); // ✅ 模拟登录成功
		// const queryClient = new QueryClient();
		const user = userEvent.setup();

		render(
			<LoginForm />,
		);

		// ✅ 查找输入框和按钮
		const usernameInput = screen.getByPlaceholderText(/input username/i) as HTMLInputElement;
		const passwordInput = screen.getByPlaceholderText(/input password/i) as HTMLInputElement;

		// 清空输入框
		usernameInput.value = "";
		passwordInput.value = "";
		const submitButton = screen.getByRole("button", { name: /sign in/i });

		// ✅ 模拟用户输入
		await user.type(usernameInput, "guest");
		await user.type(passwordInput, "12345678");
		await user.click(submitButton);

		// ✅ 验证 signIn 调用
		await waitFor(() => {
			expect(mockSignIn).toHaveBeenCalledWith({
				username: "guest",
				password: "12345678",
				systemName: "React System",
			});
		});

		// ✅ 验证 toast.success 调用
		expect(toast.success).toHaveBeenCalledWith("Sign in success!", {
			closeButton: true,
		});

		// ✅ 验证 navigate 调用
		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalled();
		});
	});

	test("shows error toast on signIn failure", async () => {
		mockSignIn.mockRejectedValueOnce(new Error("Invalid credentials"));
		//const queryClient = new QueryClient();
		const user = userEvent.setup();

		render(
			<LoginForm />,
		);
		const usernameInput = screen.getByPlaceholderText(/input username/i) as HTMLInputElement;
		const passwordInput = screen.getByPlaceholderText(/input password/i) as HTMLInputElement;

		// 清空输入框
		usernameInput.value = "";
		passwordInput.value = "";
		const submitButton = screen.getByRole("button", { name: /sign in/i });

		await user.type(usernameInput, "guest");
		await user.type(passwordInput, "wrong");
		await user.click(submitButton);

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith("Invalid credentials", {
				closeButton: true,
			});
		});
	});
});
