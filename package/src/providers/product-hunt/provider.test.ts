import { describe, expect, test } from "bun:test";
import { productHuntProvider } from "./provider";

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
			t => t.name === "graphql_posts"
		);
		expect(postsQuery).toBeDefined();

		const result = await postsQuery!.fn({
			first: 1
		});

		expect(result.data.posts.edges).toBeDefined();
		expect(result.data.posts.edges.length).toBe(1);
		expect(result.data.posts.edges[0].node.id).toBeDefined();
	});
});
