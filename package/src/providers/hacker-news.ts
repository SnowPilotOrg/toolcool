import { z } from "zod";
import type { Tool, ToolProvider } from "../index";

export const getTopStoriesInput = z
	.object({
		limit: z
			.number()
			.default(10)
			.describe("Number of stories to return (defaults to 10)"),
	})
	.describe("Input for the getTopStories tool");

export const storySchema = z
	.object({
		by: z.string().describe("The username of the author of the story"),
		descendants: z.number().describe("The number of comments on the story"),
		kids: z.array(z.number()).describe("The ids of the comments on the story"),
		id: z.number().describe("The id of the story"),
		score: z.number().describe("The score of the story"),
		time: z.number().describe("The time the story was posted"),
		title: z.string().describe("The title of the story"),
		type: z.string().describe("The type of post"),
		url: z.string().describe("The URL of the story"),
	})
	.describe("A story on Hacker News");

const getTopStoriesOutput = z.array(storySchema);

const getTopStoriesTool: Tool = {
	name: "getTopStories",
	description: "Get the current top stories from Hacker News",
	inputSchema: getTopStoriesInput,
	outputSchema: getTopStoriesOutput,
	fn: async (args) => {
		const limit = args.limit ?? 10;
		const response = await fetch(
			"https://hacker-news.firebaseio.com/v0/topstories.json",
		);
		const ids = await response.json();
		return Promise.all(
			ids.slice(0, limit).map(async (id: number) => {
				const storyResponse = await fetch(
					`https://hacker-news.firebaseio.com/v0/item/${id}.json`,
				);
				const body = await storyResponse.json();
				return storySchema.parse(body);
			}),
		);
	},
};

export class HackerNewsProvider implements ToolProvider {
	name = "hacker-news";

	discoverTools(): Tool[] {
		return [getTopStoriesTool];
	}
}
