import { Button } from "@nextui-org/react";

export const Recommendations = ({
	handleSend,
}: { handleSend: (prompt: string) => void }) => (
	<div className="flex flex-wrap gap-2">
		{[
			{
				text: "Latest HN News",
				prompt: "Explain the latest news from Hacker News",
			},
			{
				text: "Trending Topics",
				prompt: "What are the top trending topics?",
			},
			{
				text: "Interesting Discussions",
				prompt: "Summarize the most interesting discussions",
			},
			{
				text: "Top Products",
				prompt:
					"What are the most upvoted products on Product Hunt and Hacker News today?",
			},
		].map(({ text, prompt }) => (
			<Button
				key={text}
				size="sm"
				variant="flat"
				onClick={() => {
					handleSend(prompt);
				}}
			>
				{text}
			</Button>
		))}
	</div>
);
