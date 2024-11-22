import { describe, expect, test } from "bun:test";
import { productHuntProvider } from "./provider";
import OpenAI from "openai";
import { toOpenAIFormat, callTools } from "../..";

describe("Product Hunt Provider", () => {
	test("should generate tools from schema", () => {
		expect(productHuntProvider.tools).toBeDefined();
		expect(productHuntProvider.tools.length).toBeGreaterThan(0);
	});

	test("should fetch posts", async () => {
		// Skip if no API token
		if (!process.env.PRODUCT_HUNT_API_TOKEN) {
			console.log("Skipping test - no API token");
			return;
		}

		const postsQuery = productHuntProvider.tools.find(
			(t) => t.name === "graphql_posts",
		);
		expect(postsQuery).toBeDefined();
		if (!postsQuery) throw new Error("Posts query not found");

		const result = await postsQuery.fn({
			first: 1,
		});

		console.log(JSON.stringify(result, null, 2));

		expect(result.data.posts.edges).toBeDefined();
		expect(result.data.posts.edges.length).toBe(1);
		expect(result.data.posts.edges[0].node.id).toBeDefined();
	});

	test("should fetch collections", async () => {
		if (!process.env.PRODUCT_HUNT_API_TOKEN) {
			console.log("Skipping test - no API token");
			return;
		}

		const collectionsQuery = productHuntProvider.tools.find(
			(t) => t.name === "graphql_collections",
		);
		expect(collectionsQuery).toBeDefined();
		if (!collectionsQuery) throw new Error("Collections query not found");

		const result = await collectionsQuery.fn({
			first: 1,
		});

		console.log("Collections result:", JSON.stringify(result, null, 2));
	});

	test("should fetch topics", async () => {
		if (!process.env.PRODUCT_HUNT_API_TOKEN) {
			console.log("Skipping test - no API token");
			return;
		}

		const topicsQuery = productHuntProvider.tools.find(
			(t) => t.name === "graphql_topics",
		);
		expect(topicsQuery).toBeDefined();
		if (!topicsQuery) throw new Error("Topics query not found");

		const result = await topicsQuery.fn({
			first: 1,
		});

		console.log("Topics result:", JSON.stringify(result, null, 2));
	});

	test("should handle OpenAI tool calls for different types", async () => {
		if (!process.env.PRODUCT_HUNT_API_TOKEN) {
			console.log("Skipping test - no API token");
			return;
		}

		const openai = new OpenAI();

		// Test different prompts that will trigger different types
		const prompts = [
			"Show me some Product Hunt collections",
			"What topics are trending on Product Hunt?",
			"Show me the latest posts on Product Hunt",
		];

		for (const prompt of prompts) {
			const completion = await openai.chat.completions.create({
				model: "gpt-4",
				messages: [{ role: "user", content: prompt }],
				tools: toOpenAIFormat(productHuntProvider.tools),
				tool_choice: "auto",
			});

			console.log(
				`OpenAI Response for "${prompt}":`,
				JSON.stringify(completion.choices[0].message, null, 2),
			);

			const results = await callTools(
				productHuntProvider.tools,
				completion.choices[0].message.tool_calls || [],
			);

			expect(results).toBeDefined();
			expect(results.length).toBe(1);
		}
	});
});

test("Use OpenAI tool calling", async () => {
	// Skip if no API token
	if (!process.env.PRODUCT_HUNT_API_TOKEN) {
		console.log("Skipping test - no API token");
		return;
	}

	const openai = new OpenAI();

	const completion = await openai.chat.completions.create({
		model: "gpt-4",
		messages: [
			{
				role: "user",
				content: "Fetch 2 Product Hunt posts.",
			},
		],
		tools: toOpenAIFormat(productHuntProvider.tools),
		tool_choice: "auto",
	});

	console.debug(
		"First OpenAI Response:",
		JSON.stringify(completion.choices[0].message, null, 2),
	);

	const results = await callTools(
		productHuntProvider.tools,
		completion.choices[0].message.tool_calls || [],
	);

	// Assertions
	expect(results).toBeDefined();
	expect(results.length).toBe(1);

	// Verify the GraphQL response structure
	const phResult = results[0] as {
		data: { posts: { edges: Array<{ node: { id: string } }> } };
	};
	expect(phResult.data).toBeDefined();
	expect(phResult.data.posts).toBeDefined();
	expect(phResult.data.posts.edges).toBeDefined();
	expect(Array.isArray(phResult.data.posts.edges)).toBe(true);
	expect(phResult.data.posts.edges.length).toBeLessThanOrEqual(2);
	expect(phResult.data.posts.edges[0].node.id).toBeDefined();
});
