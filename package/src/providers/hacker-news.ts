import type { Tool, ToolProvider } from "../index";

export class HackerNewsProvider implements ToolProvider {
	name = "hacker-news";

	discoverTools(): Tool[] {
		return [
			{
				name: "getTopStories",
				description: "Get the current top stories from Hacker News",
				parameters: {
					type: "object",
					properties: {
						limit: {
							type: "number",
							description: "Number of stories to return",
							default: 10,
						},
					},
				},
				fn: async ({ limit = 10 }) => {
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
			// Add more Hacker News tools here...
		];
	}
}
