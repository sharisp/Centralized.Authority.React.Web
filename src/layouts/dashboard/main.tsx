import { LineLoading } from "@/components/loading";
import { useSettings } from "@/store/settingStore";
import { ThemeLayout } from "@/types/enum";
import { ScrollArea } from "@/ui/scroll-area";
import { cn } from "@/utils";
import { Suspense } from "react";
import { Outlet } from "react-router";




const Main = () => {
	const { themeStretch, themeLayout } = useSettings();


	return (
		<ScrollArea
			data-slot="slash-layout-main"
			className={cn("flex w-full grow bg-background p-2", {
				"h-[calc(100vh-var(--layout-header-height))]": themeLayout !== ThemeLayout.Horizontal,
				"h-[calc(100vh-var(--layout-header-height)-var(--layout-nav-height-horizontal)-10px)]": themeLayout === ThemeLayout.Horizontal,
			})}
		>
			<Suspense fallback={<LineLoading />}>
				<main
					className={cn("w-full h-full mx-auto", {
						"xl:max-w-screen-xl": !themeStretch,
					})}
				>
					<Outlet />
				</main>
			</Suspense>
		</ScrollArea>
	);
};

export default Main;
