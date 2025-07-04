import { useSettings } from "@/store/settingStore";
import { cn } from "@/utils";
import type { ReactNode } from "react";
import AccountDropdown from "../components/account-dropdown";
import BreadCrumb from "../components/bread-crumb";
import SearchBar from "../components/search-bar";
import SettingButton from "../components/setting-button";

interface HeaderProps {
	leftSlot?: ReactNode;
}

export default function Header({ leftSlot }: HeaderProps) {
	const { breadCrumb } = useSettings();
	return (
		<header
			data-slot="slash-layout-header"
			className={cn(
				"sticky z-app-bar top-0 right-0 left-0 flex items-center bg-background justify-between px-2 ml-[1px]",
				"h-[var(--layout-header-height)] grow-0 shrink-0",
			)}
		>
			<div className="flex items-center">
				{leftSlot}

				<div className="hidden md:block ml-4">{breadCrumb && <BreadCrumb />}</div>
			</div>

			<div className="flex items-center gap-1">
				<SearchBar />

				<SettingButton />
				<AccountDropdown />
			</div>
		</header>
	);
}
