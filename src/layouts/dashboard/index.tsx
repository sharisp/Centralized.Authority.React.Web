import Logo from "@/components/logo";
import type { NavProps } from "@/components/nav";
import { down, useMediaQuery } from "@/hooks";
import { useSettings } from "@/store/settingStore";
import type { MenusTree } from "@/types/loginEntity";
import { ThemeLayout } from "#/enum";
import Header from "./header";
import Main from "./main";
import { NavHorizontalLayout, NavMobileLayout, NavVerticalLayout } from "./nav";
import { convertToNavTree } from "./nav/nav-data/nav-data-backend";

interface DashboardLayoutProps {
	menuTree: MenusTree[];
}
interface DashboardNavProps {
	data: NavProps["data"];
}
export default function DashboardLayout({ menuTree }: DashboardLayoutProps) {
	const isMobile = useMediaQuery(down("md"));
	const navTreeData = convertToNavTree(menuTree);
	return (
		<div data-slot="slash-layout-root" className="w-full min-h-svh bg-background">
			{isMobile ? <MobileLayout data={navTreeData} /> : <PcLayout data={navTreeData} />}
		</div>
	);
}

function MobileLayout({ data }: DashboardNavProps) {
	return (
		<div className="flex flex-col">
			<Header leftSlot={<NavMobileLayout data={data} />} />
			<Main />
		</div>
	);
}

function PcLayout({ data }: DashboardNavProps) {
	const { themeLayout } = useSettings();

	if (themeLayout === ThemeLayout.Horizontal) return <PcHorizontalLayout data={data} />;
	return <PcVerticalLayout data={data} />;
}

function PcHorizontalLayout({ data }: DashboardNavProps) {
	return (
		<div data-slot="slash-layout-content" className="w-full h-screen flex flex-col transition-all duration-300 ease-in-out">
			<Header leftSlot={<Logo />} />
			<NavHorizontalLayout data={data} />
			<Main />
		</div>
	);
}

function PcVerticalLayout({ data }: DashboardNavProps) {
	const settings = useSettings();
	const { themeLayout } = settings;
	const contentPaddingLeft = themeLayout === ThemeLayout.Vertical ? "var(--layout-nav-width)" : "var(--layout-nav-width-mini)";

	return (
		<>
			<NavVerticalLayout data={data} />
			<div
				data-slot="slash-layout-content"
				className="w-full flex flex-col transition-[padding] duration-300 ease-in-out"
				style={{
					paddingLeft: contentPaddingLeft,
				}}
			>
				<Header />
				<Main />
			</div>
		</>
	);
}
