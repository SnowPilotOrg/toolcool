/// <reference types="bun-types" />

import { expect, test } from "bun:test";
import OpenAI from "openai";
import { callTools, hackerNewsTools, toOpenAIFormat } from "../index";

test("Hacker News Tool - should fetch top stories", async () => {
	const openai = new OpenAI();

	// First message to get HN stories
	const completion = await openai.chat.completions.create({
		model: "gpt-4",
		messages: [
			{
				role: "user",
				content: "Use getTopStories to fetch 2 Hacker News stories.",
			},
		],
		tools: toOpenAIFormat(hackerNewsTools),
		tool_choice: "auto",
	});

	console.debug(
		"First OpenAI Response:",
		JSON.stringify(completion.choices[0].message, null, 2),
	);

	const results = await callTools(
		hackerNewsTools,
		completion.choices[0].message.tool_calls || [],
	);

	// Assertions
	expect(results).toBeDefined();
	expect(results.length).toBe(1);

	// Verify HN stories were fetched
	const hnResult = results.find((r) => Array.isArray(r));
	expect(hnResult).toBeDefined();
	if (Array.isArray(hnResult)) {
		expect(hnResult.length).toBeLessThanOrEqual(2);
		expect(hnResult[0]).toHaveProperty("title");
		expect(hnResult[0]).toHaveProperty("url");
	}
});
