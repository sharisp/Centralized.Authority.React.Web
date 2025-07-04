import BannerCard from "./banner-card";

function Workbench() {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-col lg:flex-row gap-2">
				<div className="flex-1 md:flex-2">
					<BannerCard />
				</div>

			</div>

		</div>
	);
}

export default Workbench;
