import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
jest.mock("@/store/userStore", () => ({
	useUserPermissions: jest.fn(() => ["success.permission"]),
	useUserInfo: jest.fn(() => ({ id: 1, name: "Test User" })),
	useUserToken: jest.fn(() => "fake-token"),
	useUserRoles: jest.fn(() => []),
	useUserActions: jest.fn(() => ({})),
}));

describe("Permission", () => {
	const renderPermission = ({ enableButtonPermission, permissionKey }: { enableButtonPermission: boolean; permissionKey: string }) => {
		jest.resetModules();
		jest.doMock("@/global-config", () => ({
			GLOBAL_CONFIG: { enableButtonPermission },
		}));
		const { Permission } = require("@/mycomponent/Permission");
		return render(
			<Permission permissionKey={permissionKey}>
				<div>Test Content</div>
			</Permission>,
		);
	};

	test("renders children if global config disallows it", () => {
		renderPermission({ enableButtonPermission: false, permissionKey: "" });
		expect(screen.getByText("Test Content")).toBeInTheDocument();
	});
	test("does not render children if global config allows it,but not have permission", () => {
		renderPermission({ enableButtonPermission: true, permissionKey: "fail.permission" });
		expect(screen.queryByText("Test Content")).not.toBeInTheDocument();
	});

	test("render children if global config allows it,and have permission", () => {
		renderPermission({ enableButtonPermission: true, permissionKey: "success.permission" });
		expect(screen.getByText("Test Content")).toBeInTheDocument();
	});
});
