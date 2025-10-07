import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest", // 或使用 babel-jest
	testEnvironment: "jest-environment-jsdom", // 确保拼写正确
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1", // 对应 "@/..." → src/...
		"^#/(.*)$": "<rootDir>/src/types/$1", // 对应 "#/..." → src/types/...
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
	},
};

export default config;
