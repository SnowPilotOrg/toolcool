import { z } from "zod";
import type { Tool, ToolProvider } from "../index";

// references:
// http://api-v2-docs.producthunt.com.s3-website-us-east-1.amazonaws.com/operation/query/
// https://api.producthunt.com/v2/docs

export const graphQLInput = z
	.object({
		query: z.string().describe("The GraphQL query to execute"),
		variables: z
			.record(z.any())
			.optional()
			.describe("Variables for the GraphQL query"),
	})
	.describe("The GraphQL query to read data from Product Hunt");

const postSchema = z.object({
	id: z.string().describe("The ID of the post"),
	name: z.string().describe("The name of the post"),
	tagline: z.string().describe("The tagline of the post"),
	description: z.string().optional().describe("The description of the post"),
	url: z.string().describe("The URL of the post"),
	votesCount: z.number().describe("Number of votes"),
	commentsCount: z.number().describe("Number of comments"),
	createdAt: z.string().describe("When the post was created"),
	featured: z.boolean().describe("Whether the post is featured"),
});

export const graphQLOutput = z.object({
	data: z.record(z.any()).describe("The GraphQL response data"),
	errors: z
		.array(
			z.object({
				message: z.string(),
				locations: z
					.array(
						z.object({
							line: z.number(),
							column: z.number(),
						}),
					)
					.optional(),
				path: z.array(z.string()).optional(),
			}),
		)
		.optional()
		.describe("Any errors that occurred during the query"),
});

const queryProductHuntTool: Tool = {
	name: "queryProductHunt",
	description: `Query Product Hunt's GraphQL API to fetch data about posts, collections, topics, and users.
Example query structure for posts:
{
  posts(first: 5) {
    edges {
      node {
        id
        name
        tagline
        url
        votesCount
        commentsCount
      }
    }
  }
}`,
	inputSchema: graphQLInput,
	outputSchema: graphQLOutput,
	fn: async (args) => {
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
			body: JSON.stringify({
				query: args.query,
				variables: args.variables || {},
			}),
		});

		const data = await response.json();

		// Log the raw response for debugging
		console.log("Product Hunt API Response:", JSON.stringify(data, null, 2));

		if (!response.ok) {
			throw new Error(
				`Product Hunt API request failed: ${response.statusText}\nResponse: ${JSON.stringify(data, null, 2)}`,
			);
		}

		// Handle GraphQL errors
		if (data.errors) {
			throw new Error(
				`GraphQL Errors: ${JSON.stringify(data.errors, null, 2)}`,
			);
		}

		// Ensure data exists before parsing
		if (!data.data) {
			throw new Error(
				`Invalid response format: ${JSON.stringify(data, null, 2)}`,
			);
		}

		return graphQLOutput.parse({
			data: data.data,
			errors: data.errors,
		});
	},
};

export const productHuntProvider: ToolProvider = {
	name: "product-hunt",
	tools: [queryProductHuntTool],
};
