
// Generated file, do not edit directly

import { z } from "zod";
import type { Tool } from "../../index";

// Common schemas
const nodeSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	tagline: z.string().optional(),
	url: z.string().optional(),
	votesCount: z.number().optional(),
	createdAt: z.string().optional(),
});

// Tool Definitions
export const productHuntTools: Tool[] = [
	{
		name: "graphql_collection",
		description: "Look up a Collection(only published).",
		inputSchema: z.object({
			first: z.number().optional().default(10),
			after: z.string().optional(),
			before: z.string().optional(),
			last: z.number().optional()
		}),
		outputSchema: z.object({
			data: z.object({
				collection: z.object({
					edges: z.array(
						z.object({
							node: nodeSchema
						})
					)
				})
			})
		}),
		fn: async (args) => {
			const query = `
				query collection($first: Int, $after: String, $before: String, $last: Int) {
					collection(first: $first, after: $after, before: $before, last: $last) {
						edges {
							node {
								id
								name
								description
								tagline
								url
								votesCount
								createdAt
							}
						}
					}
				}
			`;

			const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`
				},
				body: JSON.stringify({
					query,
					variables: args
				})
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
	},
  {
		name: "graphql_collections",
		description: "Look up Collections by various parameters.",
		inputSchema: z.object({
			first: z.number().optional().default(10),
			after: z.string().optional(),
			before: z.string().optional(),
			last: z.number().optional()
		}),
		outputSchema: z.object({
			data: z.object({
				collections: z.object({
					edges: z.array(
						z.object({
							node: nodeSchema
						})
					)
				})
			})
		}),
		fn: async (args) => {
			const query = `
				query collections($first: Int, $after: String, $before: String, $last: Int) {
					collections(first: $first, after: $after, before: $before, last: $last) {
						edges {
							node {
								id
								name
								description
								tagline
								url
								votesCount
								createdAt
							}
						}
					}
				}
			`;

			const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`
				},
				body: JSON.stringify({
					query,
					variables: args
				})
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
	},
  {
		name: "graphql_comment",
		description: "Look up a Comment.",
		inputSchema: z.object({
			first: z.number().optional().default(10),
			after: z.string().optional(),
			before: z.string().optional(),
			last: z.number().optional()
		}),
		outputSchema: z.object({
			data: z.object({
				comment: z.object({
					edges: z.array(
						z.object({
							node: nodeSchema
						})
					)
				})
			})
		}),
		fn: async (args) => {
			const query = `
				query comment($first: Int, $after: String, $before: String, $last: Int) {
					comment(first: $first, after: $after, before: $before, last: $last) {
						edges {
							node {
								id
								name
								description
								tagline
								url
								votesCount
								createdAt
							}
						}
					}
				}
			`;

			const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`
				},
				body: JSON.stringify({
					query,
					variables: args
				})
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
	},
  {
		name: "graphql_post",
		description: "Look up a Post.",
		inputSchema: z.object({
			first: z.number().optional().default(10),
			after: z.string().optional(),
			before: z.string().optional(),
			last: z.number().optional()
		}),
		outputSchema: z.object({
			data: z.object({
				post: z.object({
					edges: z.array(
						z.object({
							node: nodeSchema
						})
					)
				})
			})
		}),
		fn: async (args) => {
			const query = `
				query post($first: Int, $after: String, $before: String, $last: Int) {
					post(first: $first, after: $after, before: $before, last: $last) {
						edges {
							node {
								id
								name
								description
								tagline
								url
								votesCount
								createdAt
							}
						}
					}
				}
			`;

			const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`
				},
				body: JSON.stringify({
					query,
					variables: args
				})
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
	},
  {
		name: "graphql_posts",
		description: "Look up Posts by various parameters.",
		inputSchema: z.object({
			first: z.number().optional().default(10),
			after: z.string().optional(),
			before: z.string().optional(),
			last: z.number().optional()
		}),
		outputSchema: z.object({
			data: z.object({
				posts: z.object({
					edges: z.array(
						z.object({
							node: nodeSchema
						})
					)
				})
			})
		}),
		fn: async (args) => {
			const query = `
				query posts($first: Int, $after: String, $before: String, $last: Int) {
					posts(first: $first, after: $after, before: $before, last: $last) {
						edges {
							node {
								id
								name
								description
								tagline
								url
								votesCount
								createdAt
							}
						}
					}
				}
			`;

			const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`
				},
				body: JSON.stringify({
					query,
					variables: args
				})
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
	},
  {
		name: "graphql_topic",
		description: "Look up a Topic.",
		inputSchema: z.object({
			first: z.number().optional().default(10),
			after: z.string().optional(),
			before: z.string().optional(),
			last: z.number().optional()
		}),
		outputSchema: z.object({
			data: z.object({
				topic: z.object({
					edges: z.array(
						z.object({
							node: nodeSchema
						})
					)
				})
			})
		}),
		fn: async (args) => {
			const query = `
				query topic($first: Int, $after: String, $before: String, $last: Int) {
					topic(first: $first, after: $after, before: $before, last: $last) {
						edges {
							node {
								id
								name
								description
								tagline
								url
								votesCount
								createdAt
							}
						}
					}
				}
			`;

			const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`
				},
				body: JSON.stringify({
					query,
					variables: args
				})
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
	},
  {
		name: "graphql_topics",
		description: "Look up Topics by various parameters.",
		inputSchema: z.object({
			first: z.number().optional().default(10),
			after: z.string().optional(),
			before: z.string().optional(),
			last: z.number().optional()
		}),
		outputSchema: z.object({
			data: z.object({
				topics: z.object({
					edges: z.array(
						z.object({
							node: nodeSchema
						})
					)
				})
			})
		}),
		fn: async (args) => {
			const query = `
				query topics($first: Int, $after: String, $before: String, $last: Int) {
					topics(first: $first, after: $after, before: $before, last: $last) {
						edges {
							node {
								id
								name
								description
								tagline
								url
								votesCount
								createdAt
							}
						}
					}
				}
			`;

			const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`
				},
				body: JSON.stringify({
					query,
					variables: args
				})
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
	},
  {
		name: "graphql_user",
		description: "Look up a User.",
		inputSchema: z.object({
			first: z.number().optional().default(10),
			after: z.string().optional(),
			before: z.string().optional(),
			last: z.number().optional()
		}),
		outputSchema: z.object({
			data: z.object({
				user: z.object({
					edges: z.array(
						z.object({
							node: nodeSchema
						})
					)
				})
			})
		}),
		fn: async (args) => {
			const query = `
				query user($first: Int, $after: String, $before: String, $last: Int) {
					user(first: $first, after: $after, before: $before, last: $last) {
						edges {
							node {
								id
								name
								description
								tagline
								url
								votesCount
								createdAt
							}
						}
					}
				}
			`;

			const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`
				},
				body: JSON.stringify({
					query,
					variables: args
				})
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
	},
  {
		name: "graphql_viewer",
		description: "Top level scope for currently authenticated user.",
		inputSchema: z.object({
			first: z.number().optional().default(10),
			after: z.string().optional(),
			before: z.string().optional(),
			last: z.number().optional()
		}),
		outputSchema: z.object({
			data: z.object({
				viewer: z.object({
					edges: z.array(
						z.object({
							node: nodeSchema
						})
					)
				})
			})
		}),
		fn: async (args) => {
			const query = `
				query viewer($first: Int, $after: String, $before: String, $last: Int) {
					viewer(first: $first, after: $after, before: $before, last: $last) {
						edges {
							node {
								id
								name
								description
								tagline
								url
								votesCount
								createdAt
							}
						}
					}
				}
			`;

			const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`
				},
				body: JSON.stringify({
					query,
					variables: args
				})
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
	}
];