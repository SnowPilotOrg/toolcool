import {
	faHackerNews,
	faProductHunt,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Placeholder = () => {
	return (
		<div className="flex flex-col items-center gap-4 p-8">
			<div className="flex gap-2">
				<FontAwesomeIcon
					icon={faHackerNews}
					style={{ color: "#f26522" }}
					size="2x"
				/>
				<FontAwesomeIcon
					icon={faProductHunt}
					style={{ color: "#da552f" }}
					size="2x"
				/>
			</div>

			<p className="text-lg text-gray-600">Find what's popping</p>
		</div>
	);
};
