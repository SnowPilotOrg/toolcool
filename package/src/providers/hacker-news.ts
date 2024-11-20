import { z } from "zod";
import type { Tool, ToolProvider } from "../index";

const getTopStoriesParams = z.object({
	limit: z
		.number()
		.default(10)
		.describe("Number of stories to return (defaults to 10)"),
});

type GetTopStoriesParams = z.infer<typeof getTopStoriesParams>;

export class HackerNewsProvider implements ToolProvider {
	name = "hacker-news";

	discoverTools(): Tool[] {
		return [
			{
				name: "getTopStories",
				description: "Get the current top stories from Hacker News",
				inputSchema: {
					type: "object",
					properties: {
						limit: {
							type: "number",
							description: "Number of stories to return (defaults to 10)",
							default: 10,
						},
					},
				},
				outputSchema: {
					type: "object",
					properties: {
						by: {
							type: "string",
							description: "The username of the author of the story",
						},
						descendants: {
							type: "number",
							description: "The number of comments on the story",
						},
						kids: {
							type: "array",
							description: "The ids of the comments on the story",
						},
						id: {
							type: "number",
							description: "The id of the story",
						},
						score: {
							type: "number",
							description: "The score of the story",
						},
						time: {
							type: "number",
							description: "The time the story was posted",
						},
						title: {
							type: "string",
							description: "The title of the story",
						},
						type: {
							type: "string",
							description: "The type of post",
						},
						url: {
							type: "string",
							description: "The URL of the story",
						},
					},
				},
				fn: async (args: unknown) => {
					const limit = (args as GetTopStoriesParams).limit ?? 10;
					const response = await fetch(
						"https://hacker-news.firebaseio.com/v0/topstories.json",
					);
					const ids = await response.json();
					return Promise.all(
						ids.slice(0, limit).map(async (id: number) => {
							const storyResponse = await fetch(
								`https://hacker-news.firebaseio.com/v0/item/${id}.json`,
							);
							return storyResponse.json();
						}),
					);
				},
			},
		];
	}
}
