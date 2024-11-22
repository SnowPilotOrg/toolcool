import { readFileSync } from "node:fs";
import { z } from "zod";
import { parseSchema } from "../../graphql/schema-parser";
import { generateQueryBuilders } from "../../graphql/query-builder";

const schema = readFileSync("./schema.graphql", "utf-8");
const types = parseSchema(schema);
const queryBuilders = generateQueryBuilders(types);

// Define output schemas
const postsOutputSchema = z.object({
	data: z.object({
		posts: z.object({
			edges: z.array(
				z.object({
					node: z.object({
						id: z.string(),
						name: z.string(),
						tagline: z.string().optional(),
						description: z.string().optional(),
						url: z.string().optional(),
						votesCount: z.number().optional(),
						createdAt: z.string().optional(),
					}),
				}),
			),
		}),
	}),
});

const usersOutputSchema = z.object({
	data: z.object({
		users: z.object({
			edges: z.array(
				z.object({
					node: z.object({
						id: z.string(),
						name: z.string(),
						username: z.string(),
						headline: z.string().optional(),
						websiteUrl: z.string().optional(),
						twitterUsername: z.string().optional(),
					}),
				}),
			),
		}),
	}),
});

const DEFAULT_POST_FIELDS = ["id", "name", "tagline", "description"] as const;
const DEFAULT_USER_FIELDS = ["id", "name", "username"] as const;

type PostFields = (typeof DEFAULT_POST_FIELDS)[number];
type UserFields = (typeof DEFAULT_USER_FIELDS)[number];

async function executeGraphQLQuery<T>(
	query: string,
	variables: Record<string, unknown>,
): Promise<T> {
	const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`,
		},
		body: JSON.stringify({
			query,
			variables,
		}),
	});

	if (!response.ok) {
		throw new Error(`GraphQL request failed: ${response.statusText}`);
	}

	const result = await response.json();
	if (result.errors) {
		throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
	}

	return result;
}

const tools = [
	{
		name: "product_hunt_posts",
		description:
			"Fetch posts from Product Hunt. You can specify the number of posts and pagination cursor.",
		inputSchema: z.object({
			fields: z
				.array(
					z.enum([
						"id",
						"name",
						"tagline",
						"description",
						"url",
						"votesCount",
						"createdAt",
					]),
				)
				.optional()
				.default(() => [...DEFAULT_POST_FIELDS]),
			first: z.number().optional().default(10),
			after: z.string().optional(),
			featured: z.boolean().optional(),
		}),
		outputSchema: postsOutputSchema,
		fn: async ({
			fields = DEFAULT_POST_FIELDS,
			first = 10,
			after,
			featured,
		}: {
			fields?: PostFields[];
			first?: number;
			after?: string;
			featured?: boolean;
		}) => {
			const query = `
        query Posts($first: Int, $after: String, $featured: Boolean) {
          posts(first: $first, after: $after, featured: $featured) {
            edges {
              node {
                ${fields.join("\n")}
              }
            }
          }
        }
      `;

			return executeGraphQLQuery(query, { first, after, featured });
		},
	},
	{
		name: "product_hunt_users",
		description:
			"Fetch users from Product Hunt. You can specify the number of users and pagination cursor.",
		inputSchema: z.object({
			fields: z
				.array(
					z.enum([
						"id",
						"name",
						"username",
						"headline",
						"websiteUrl",
						"twitterUsername",
					]),
				)
				.optional()
				.default(() => [...DEFAULT_USER_FIELDS]),
			first: z.number().optional().default(10),
			after: z.string().optional(),
		}),
		outputSchema: usersOutputSchema,
		fn: async ({
			fields = DEFAULT_USER_FIELDS,
			first = 10,
			after,
		}: {
			fields?: UserFields[];
			first?: number;
			after?: string;
		}) => {
			const query = `
        query Users($first: Int, $after: String) {
          users(first: $first, after: $after) {
            edges {
              node {
                ${fields.join("\n")}
              }
            }
          }
        }
      `;

			return executeGraphQLQuery(query, { first, after });
		},
	},
] as const;

export const productHuntTools = tools;
export const productHuntProvider = { tools };
