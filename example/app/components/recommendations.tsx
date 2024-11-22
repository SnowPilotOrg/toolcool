import { Button } from "@nextui-org/react";
import { BrandIcon } from "./brand-icon";

export const Recommendations = ({
	handleSend,
}: { handleSend: (prompt: string) => void }) => (
	<div className="flex flex-wrap gap-2">
		{[
			{
				brand: ["hacker-news"],
				text: "Latest HN News",
				prompt: "Explain the latest news from Hacker News",
			},
			{
				brand: ["product-hunt", "hacker-news"],
				text: "Trending Topics",
				prompt:
					"What are the top trending topics? Check both Hacker News and Product Hunt",
			},
			{
				brand: ["hacker-news"],
				text: "Interesting Discussions",
				prompt: "Summarize the most interesting discussions on Hacker News",
			},
			{
				brand: ["product-hunt"],
				text: "Top Products",
				prompt: "What are the most upvoted products on Product Hunt today?",
			},
		].map(({ brand, text, prompt }) => (
			<Button
				key={`${text}-${brand.join('-')}`}
				size="md"
				variant="flat"
				onClick={() => {
					handleSend(prompt);
				}}
				className="flex items-center gap-2"
			>
				<div className="flex gap-1">
					{brand.map((b) => (
						<BrandIcon key={b} brand={b as "hacker-news" | "product-hunt"} />
					))}
				</div>
				{text}
			</Button>
		))}
	</div>
);
