import { faHackerNews } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Placeholder = () => {
	return (
		<div className="flex flex-col items-center gap-4 p-8">
			<FontAwesomeIcon
				icon={faHackerNews}
				style={{ color: "#f26522" }}
				size="2x"
			/>

			<p className="text-lg text-gray-600">How can I help you?</p>
		</div>
	);
};
