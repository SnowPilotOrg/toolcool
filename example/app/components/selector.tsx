import { faHackerNews } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tab, Tabs } from "@nextui-org/react";

export const Selector = () => {
	return (
		<Tabs aria-label="Options">
			<Tab
				key="hacker-news"
				title={
					<div className="flex items-center space-x-2">
						<FontAwesomeIcon icon={faHackerNews} style={{ color: "#f26522" }} />
						<span>Hacker News</span>
					</div>
				}
			/>
		</Tabs>
	);
};
