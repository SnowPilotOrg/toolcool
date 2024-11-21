/// <reference types="bun-types" />

import { test, expect } from "bun:test";
import { callTools, discoverTools, type Tool, toOpenAIFormat } from "../src";
import OpenAI from "openai";
import { z } from "zod";
test("Tool Calling E2E - should discover tools and execute OpenAI tool calls", async () => {
	// Discover available built-in tools
	const hackerNewsTools = await discoverTools(["hacker-news"]);

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
		tools: toOpenAIFormat(...allTools),
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
		tools: toOpenAIFormat(...allTools),
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
