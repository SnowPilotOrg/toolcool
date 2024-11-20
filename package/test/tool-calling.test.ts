import { test, expect } from "bun:test";
import {
	discoverTools,
	toolsToOpenAIFormat,
	executeToolCalls,
	type Tool,
} from "../src";
import { getProviders } from "../src/providers";
import { OpenAI } from "openai";

test("Tool Calling E2E - should discover tools and execute OpenAI tool calls", async () => {
	const tools = new Map<string, Tool>();
	const openai = new OpenAI();

	// Discover available tools
	const discoveredTools = await discoverTools(["hacker-news"]);

	// Register tools
	const allTools = [
		...discoveredTools,
		{
			name: "myInternalTool",
			description: "This is my internal tool",
			fn: async () => {
				return "Hello, world!";
			},
		},
	];

	// Add tools to the map
	for (const tool of allTools) {
		tools.set(tool.name, tool);
	}

	// First message to get HN stories
	const response1 = await openai.chat.completions.create({
		model: "gpt-4",
		messages: [
			{
				role: "user",
				content: "Use getTopStories to fetch 2 Hacker News stories.",
			},
		],
		tools: toolsToOpenAIFormat(tools),
		tool_choice: "auto",
	});

	console.log(
		"First OpenAI Response:",
		JSON.stringify(response1.choices[0].message, null, 2),
	);

	const firstResults = await executeToolCalls(
		tools,
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
		tools: toolsToOpenAIFormat(tools),
		tool_choice: "auto",
	});

	console.log(
		"Second OpenAI Response:",
		JSON.stringify(response2.choices[0].message, null, 2),
	);

	const secondResults = await executeToolCalls(
		tools,
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
