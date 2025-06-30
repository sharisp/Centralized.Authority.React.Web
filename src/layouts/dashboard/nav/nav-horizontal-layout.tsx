import { NavHorizontal } from "@/components/nav";
import type { NavProps } from "@/components/nav/types";
import { ScrollBar } from "@/ui/scroll-area";
import { ScrollArea } from "@/ui/scroll-area";
import { cn } from "@/utils";

export function NavHorizontalLayout({ data }: NavProps) {
	console.log("NavHorizontalLayout", data);
	return (
		<nav
			data-slot="slash-layout-nav"
			className={cn("w-full bg-background z-app-bar", "sticky top-[var(--layout-header-height)] left-0 right-0 grow-0 shrink-0")}
		>
			<ScrollArea className="whitespace-nowrap px-2 bg-background">
				<NavHorizontal data={data} />
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</nav>
	);
}
