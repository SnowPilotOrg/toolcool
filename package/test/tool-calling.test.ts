/// <reference types="bun-types" />

import { expect, test } from "bun:test";
import OpenAI from "openai";
import { z } from "zod";
import { type Tool, callTools, hackerNewsTools, toOpenAIFormat } from "../src";
import { productHuntTools } from "../src/providers";
import { graphQLOutput } from "../src/providers/product-hunt";

test("Tool Calling E2E - should discover tools and execute OpenAI tool calls", async () => {
	// Define an internal tool
	const helloWorldTool: Tool = {
		name: "helloWorldTool",
		inputSchema: z.object({}).describe("Input for the helloWorldTool"),
		outputSchema: z.string().describe("Output for the helloWorldTool"),
		description: "This is my internal tool",
		fn: async () => {
			return "Hello, world!";
		},
	};

	// Register internal tool
	const allTools = [...hackerNewsTools, helloWorldTool];

	const openai = new OpenAI();

	// First message to get HN stories
	const response1 = await openai.chat.completions.create({
		model: "gpt-4",
		messages: [
			{
				role: "user",
				content: "Use getTopStories to fetch 2 Hacker News stories.",
			},
		],
		tools: toOpenAIFormat(allTools),
		tool_choice: "auto",
	});

	console.log(
		"First OpenAI Response:",
		JSON.stringify(response1.choices[0].message, null, 2),
	);

	const firstResults = await callTools(
		allTools,
		response1.choices[0].message.tool_calls || [],
	);

	// Second message to use internal tool
	const response2 = await openai.chat.completions.create({
		model: "gpt-4",
		messages: [
			{
				role: "user",
				content: "Now use myInternalTool to say hello.",
			},
		],
		tools: toOpenAIFormat(allTools),
		tool_choice: "auto",
	});

	console.log(
		"Second OpenAI Response:",
		JSON.stringify(response2.choices[0].message, null, 2),
	);

	const secondResults = await callTools(
		allTools,
		response2.choices[0].message.tool_calls || [],
	);

	const allResults = [...firstResults, ...secondResults];
	console.log("All tool execution results:", allResults);

	// Assertions
	expect(allResults).toBeDefined();
	expect(allResults.length).toBeGreaterThan(1);

	// Verify HN stories were fetched
	const hnResult = allResults.find((r) => Array.isArray(r));
	expect(hnResult).toBeDefined();
	if (Array.isArray(hnResult)) {
		expect(hnResult.length).toBeLessThanOrEqual(2);
		expect(hnResult[0]).toHaveProperty("title");
		expect(hnResult[0]).toHaveProperty("url");
	}

	// Verify internal tool was called
	const helloResult = allResults.find((r) => r === "Hello, world!");
	expect(helloResult).toBeDefined();
});

test("Product Hunt Tool - should fetch posts via GraphQL", async () => {
	const queryTool = productHuntTools[0];

	const result = await queryTool.fn({
		query: `
			query {
				posts(first: 2, order: NEWEST) {
					edges {
						node {
							id
							name
							tagline
							url
							votesCount
							commentsCount
							createdAt
							featured
						}
					}
				}
			}
		`,
	});

	// Assertions
	expect(result).toBeDefined();
	expect(result.data).toBeDefined();
	expect(result.errors).toBeUndefined();

	const posts = result.data.posts.edges;
	expect(Array.isArray(posts)).toBe(true);
	expect(posts.length).toBeLessThanOrEqual(2);

	const firstPost = posts[0].node;
	expect(firstPost).toHaveProperty("id");
	expect(firstPost).toHaveProperty("name");
	expect(firstPost).toHaveProperty("tagline");
	expect(firstPost).toHaveProperty("url");
	expect(firstPost).toHaveProperty("votesCount");
	expect(firstPost).toHaveProperty("commentsCount");
	expect(firstPost).toHaveProperty("createdAt");
	expect(firstPost).toHaveProperty("featured");
});

test("Product Hunt Tool - OpenAI integration", async () => {
	const allTools = [...hackerNewsTools, ...productHuntTools];

	const openai = new OpenAI();

	const response = await openai.chat.completions.create({
		model: "gpt-4",
		messages: [
			{
				role: "user",
				content: "Use Product Hunt's API to fetch the 2 newest posts.",
			},
		],
		tools: toOpenAIFormat(allTools),
		tool_choice: "auto",
	});

	console.log(
		"Product Hunt OpenAI Response:",
		JSON.stringify(response.choices[0].message, null, 2),
	);

	const results = await callTools(
		allTools,
		response.choices[0].message.tool_calls || [],
	);

	expect(results).toBeDefined();
	expect(results.length).toBeGreaterThan(0);

	const phResult = graphQLOutput.parse(results[0]);
	expect(phResult.data).toBeDefined();
	expect(phResult.data).toHaveProperty("posts");
	expect(phResult.errors).toBeUndefined();
});
