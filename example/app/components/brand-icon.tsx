import {
	faHackerNews,
	faProductHunt,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type BrandIconProps = {
	brand: "hacker-news" | "product-hunt";
	size?: "sm" | "lg" | "xl" | "2x";
	className?: string;
};

export const BrandIcon = ({
	brand,
	size = "lg",
	className,
}: BrandIconProps) => {
	const iconConfig = {
		"hacker-news": {
			icon: faHackerNews,
			color: "#f26522",
		},
		"product-hunt": {
			icon: faProductHunt,
			color: "#da552f",
		},
	};

	const { icon, color } = iconConfig[brand];

	return (
		<FontAwesomeIcon
			icon={icon}
			style={{ color }}
			size={size}
			className={className}
		/>
	);
};
