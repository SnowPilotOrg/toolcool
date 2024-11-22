import { z } from "zod";
import type { Tool, ToolProvider } from "../index";
import { PostsOrderSchema } from "../generated/validators";

const queryProductHuntTool: Tool = {
	name: "queryProductHunt",
	description: "Query Product Hunt's GraphQL API to fetch posts",
	inputSchema: z.object({
		query: z.union([
			// Raw GraphQL query string
			z.string(),
			// Structured query object
			z.object({
				first: z.number().optional(),
				after: z.string().optional(),
				before: z.string().optional(),
				featured: z.boolean().optional(),
				order: PostsOrderSchema.optional(),
				postedAfter: z.string().datetime().optional(),
				postedBefore: z.string().datetime().optional(),
				topic: z.string().optional(),
				twitterUrl: z.string().optional(),
				url: z.string().optional(),
			}),
		]),
		variables: z.record(z.any()).optional(),
	}),
	outputSchema: z.object({
		data: z.object({
			posts: z.object({
				edges: z.array(
					z.object({
						node: z.object({
							id: z.string(),
							name: z.string(),
							tagline: z.string(),
							url: z.string(),
							votesCount: z.number(),
							commentsCount: z.number(),
						}),
						cursor: z.string().optional(),
					}),
				),
				pageInfo: z
					.object({
						hasNextPage: z.boolean(),
						endCursor: z.string().optional(),
					})
					.optional(),
			}),
		}),
	}),
	fn: async ({ query, variables }) => {
		if (!process.env.PRODUCT_HUNT_API_TOKEN) {
			throw new Error(
				"PRODUCT_HUNT_API_TOKEN environment variable is required",
			);
		}

		const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`,
			},
			body: JSON.stringify(
				typeof query === "string"
					? { query } // For raw GraphQL queries
					: {
							// For structured queries
							query: `
								query Posts($first: Int, $after: String, $order: PostsOrder) {
									posts(first: $first, after: $after, order: $order) {
										edges {
											node {
												id
												name
												tagline
												url
												votesCount
												commentsCount
											}
											cursor
										}
										pageInfo {
											hasNextPage
											endCursor
										}
									}
								}
							`,
							variables: query,
						},
			),
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(
				`Product Hunt API request failed: ${response.statusText}\nResponse: ${JSON.stringify(data, null, 2)}`,
			);
		}

		if (data.errors) {
			throw new Error(
				`GraphQL Errors: ${JSON.stringify(data.errors, null, 2)}`,
			);
		}

		return data;
	},
};

export const productHuntProvider: ToolProvider = {
	name: "product-hunt",
	tools: [queryProductHuntTool],
};
