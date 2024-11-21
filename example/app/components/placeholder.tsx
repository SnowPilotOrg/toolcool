import { BrandIcon } from "./brand-icon";

export const Placeholder = () => {
	return (
		<div className="flex flex-col items-center gap-4 p-8">
			<div className="flex gap-2">
				<BrandIcon brand="hacker-news" size="2x" />
				<BrandIcon brand="product-hunt" size="2x" />
			</div>

			<p className="text-gray-600 text-lg">Find what's popping</p>
		</div>
	);
};
