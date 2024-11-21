/// <reference types="bun-types" />

import { expect, test } from "bun:test";
import OpenAI from "openai";
import { callTools, hackerNewsTools, toOpenAIFormat } from "../index";
import { graphQLOutput, productHuntProvider } from "./product-hunt";

const { tools: productHuntTools } = productHuntProvider;
test("Product Hunt Tool - should fetch posts via GraphQL", async () => {
	// Skip test if no API token is available
	if (!process.env.PRODUCT_HUNT_API_TOKEN) {
		console.log("Skipping Product Hunt test - no API token available");
		return;
	}

	const queryTool = productHuntTools[0];

	try {
		const result = await queryTool.fn({
			query: `
				query {
					posts(first: 1) {
						edges {
							node {
								id
								name
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
		expect(posts.length).toBe(1);

		const firstPost = posts[0].node;
		expect(firstPost).toHaveProperty("id");
		expect(firstPost).toHaveProperty("name");
	} catch (error) {
		console.error("Product Hunt API error:", error);
		throw error;
	}
});

test("Product Hunt Tool - OpenAI integration", async () => {
	// Skip test if no API token is available
	if (!process.env.PRODUCT_HUNT_API_TOKEN) {
		console.log("Skipping Product Hunt OpenAI test - no API token available");
		return;
	}

	const allTools = [...hackerNewsTools, ...productHuntTools];
	const openai = new OpenAI();

	try {
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
	} catch (error) {
		console.error("Test error:", error);
		throw error;
	}
}, 30000); // Increased timeout to 30 seconds for the entire test
