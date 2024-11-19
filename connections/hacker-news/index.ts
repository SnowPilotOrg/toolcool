
import { z } from "zod";
//TODO: add routing to @
import type { ZodFunctionDef } from "../../lib/function";
// Base schema for common fields
export const itemFunctions: ZodFunctionDef[] = [
	{
		name: "get_item",
		description: "Get more information about an item from the hacker news api",
		schema: z.object({
			id: z.number(),
			deleted: z.boolean().optional(),
			type: z.enum(["job", "story", "comment", "poll", "pollopt"]).optional(),
			by: z.string().optional(),
			time: z.number().optional(), // Unix timestamp
			dead: z.boolean().optional(),
			kids: z.array(z.number()).optional(),
			url: z.string().optional(),
			score: z.number().optional(),
			title: z.string().optional(),
			text: z.string().optional(),
			parts: z.array(z.number()).optional(),
			descendants: z.number().optional(),
		}),
        endpoint: "https://hacker-news.firebaseio.com/v0/item/",
        endpoint_end: ".json",

	},
	{
		name: "get_user",
		description: "Get more information about a user from the hacker news api",
		schema: z.object({
			id: z.number(),
			created: z.number(), // Unix timestamp
			karma: z.number(),
			about: z.string().optional(),
			submitted: z.array(z.number()).optional(),
		}),
        endpoint: "https://hacker-news.firebaseio.com/v0/user/",
        endpoint_end: ".json",
	},
	{
		name: "get_max_item",
		description: "Get the maximum item id from the hacker news api",
		schema: z.object({
		}),
        endpoint: "https://hacker-news.firebaseio.com/v0/maxitem.json",
	},
	{
		name: "get_top_stories",
		description: "Get the top stories from the hacker news api",
		schema: z.object({}),
        endpoint: "https://hacker-news.firebaseio.com/v0/topstories.json",
	},
	{
		name: "get_new_stories",
		description: "Get the new stories from the hacker news api",
		schema: z.object({}),
        endpoint: "https://hacker-news.firebaseio.com/v0/newstories.json",
	},
	{
		name: "get_best_stories",
		description: "Get the best stories from the hacker news api",
		schema: z.object({}),
        endpoint: "https://hacker-news.firebaseio.com/v0/beststories.json",
	},
	{
		name: "get_ask_stories",
		description: "Get the ask stories from the hacker news api",
		schema: z.object({}),
        endpoint: "https://hacker-news.firebaseio.com/v0/askstories.json",
	},
	{
		name: "get_show_stories",
		description: "Get the show stories from the hacker news api",
		schema: z.object({}),
        endpoint: "https://hacker-news.firebaseio.com/v0/showstories.json",
	},
	{
		name: "get_job_stories",
		description: "Get the job stories from the hacker news api",
		schema: z.object({}),
        endpoint: "https://hacker-news.firebaseio.com/v0/jobstories.json",
	},
	{
		name: "get_updates",
		description: "Get the updates from the hacker news api",
		schema: z.object({}),
        endpoint: "https://hacker-news.firebaseio.com/v0/updates.json",
	},
];

