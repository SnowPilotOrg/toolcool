// Generated file, do not edit directly

import { z } from "zod";
import type { Tool } from "../../index";

const collectionNodeSchema = z.object({
	coverImage: z.string().optional(),
	description: z.string().optional(),
	followersCount: z.number().int(),
	id: z.string(),
	isFollowing: z.boolean(),
	name: z.string(),
	tagline: z.string(),
	url: z.string(),
	userId: z.string(),
});

const commentNodeSchema = z.object({
	body: z.string(),
	id: z.string(),
	isVoted: z.boolean(),
	parentId: z.string().optional(),
	url: z.string(),
	userId: z.string(),
	votesCount: z.number().int(),
});

const errorNodeSchema = z.object({
	field: z.string(),
	message: z.string(),
});

const mediaNodeSchema = z.object({
	type: z.string(),
	url: z.string(),
	videoUrl: z.string().optional(),
});

const mutationNodeSchema = z.object({});

const pageinfoNodeSchema = z.object({
	endCursor: z.string().optional(),
	hasNextPage: z.boolean(),
	hasPreviousPage: z.boolean(),
	startCursor: z.string().optional(),
});

const postNodeSchema = z.object({
	commentsCount: z.number().int(),
	description: z.string().optional(),
	id: z.string(),
	isCollected: z.boolean(),
	isVoted: z.boolean(),
	name: z.string(),
	reviewsCount: z.number().int(),
	reviewsRating: z.number(),
	slug: z.string(),
	tagline: z.string(),
	url: z.string(),
	userId: z.string(),
	votesCount: z.number().int(),
	website: z.string(),
});

const productlinkNodeSchema = z.object({
	type: z.string(),
	url: z.string(),
});

const queryNodeSchema = z.object({});

const topicNodeSchema = z.object({
	description: z.string(),
	followersCount: z.number().int(),
	id: z.string(),
	image: z.string().optional(),
	isFollowing: z.boolean(),
	name: z.string(),
	postsCount: z.number().int(),
	slug: z.string(),
	url: z.string(),
});

const userNodeSchema = z.object({
	coverImage: z.string().optional(),
	headline: z.string().optional(),
	id: z.string(),
	isFollowing: z.boolean().optional(),
	isMaker: z.boolean(),
	isViewer: z.boolean(),
	name: z.string(),
	profileImage: z.string().optional(),
	twitterUsername: z.string().optional(),
	url: z.string(),
	username: z.string(),
	websiteUrl: z.string().optional(),
});

const userfollowpayloadNodeSchema = z.object({
	clientMutationId: z.string().optional(),
});

const userfollowundopayloadNodeSchema = z.object({
	clientMutationId: z.string().optional(),
});

const viewerNodeSchema = z.object({});

const voteNodeSchema = z.object({
	id: z.string(),
	userId: z.string(),
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
			last: z.number().optional(),
		}),
		outputSchema: z.object({
			data: z.object({
				collection: z.object({
					edges: z.array(
						z.object({
							node: collectionNodeSchema,
						}),
					),
				}),
			}),
		}),
		fn: async (args) => {
			const query = `
					query collection($first: Int, $after: String, $before: String, $last: Int) {
						collection(first: $first, after: $after, before: $before, last: $last) {
							edges {
								node {
									coverImage
									description
									followersCount
									id
									isFollowing
									name
									tagline
									url
									userId
								}
							}
						}
					}
				`;

			const response = await fetch(
				"https://api.producthunt.com/v2/api/graphql",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`,
					},
					body: JSON.stringify({
						query,
						variables: args,
					}),
				},
			);

			if (!response.ok) {
				throw new Error(`GraphQL request failed: ${response.statusText}`);
			}

			const result = await response.json();
			if (result.errors) {
				throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
			}

			return result;
		},
	},
	{
		name: "graphql_collections",
		description: "Look up Collections by various parameters.",
		inputSchema: z.object({
			first: z.number().optional().default(10),
			after: z.string().optional(),
			before: z.string().optional(),
			last: z.number().optional(),
		}),
		outputSchema: z.object({
			data: z.object({
				collections: z.object({
					edges: z.array(
						z.object({
							node: collectionNodeSchema,
						}),
					),
				}),
			}),
		}),
		fn: async (args) => {
			const query = `
					query collections($first: Int, $after: String, $before: String, $last: Int) {
						collections(first: $first, after: $after, before: $before, last: $last) {
							edges {
								node {
									coverImage
									description
									followersCount
									id
									isFollowing
									name
									tagline
									url
									userId
								}
							}
						}
					}
				`;

			const response = await fetch(
				"https://api.producthunt.com/v2/api/graphql",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`,
					},
					body: JSON.stringify({
						query,
						variables: args,
					}),
				},
			);

			if (!response.ok) {
				throw new Error(`GraphQL request failed: ${response.statusText}`);
			}

			const result = await response.json();
			if (result.errors) {
				throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
			}

			return result;
		},
	},
	{
		name: "graphql_comment",
		description: "Look up a Comment.",
		inputSchema: z.object({
			first: z.number().optional().default(10),
			after: z.string().optional(),
			before: z.string().optional(),
			last: z.number().optional(),
		}),
		outputSchema: z.object({
			data: z.object({
				comment: z.object({
					edges: z.array(
						z.object({
							node: commentNodeSchema,
						}),
					),
				}),
			}),
		}),
		fn: async (args) => {
			const query = `
					query comment($first: Int, $after: String, $before: String, $last: Int) {
						comment(first: $first, after: $after, before: $before, last: $last) {
							edges {
								node {
									body
									id
									isVoted
									parentId
									url
									userId
									votesCount
								}
							}
						}
					}
				`;

			const response = await fetch(
				"https://api.producthunt.com/v2/api/graphql",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`,
					},
					body: JSON.stringify({
						query,
						variables: args,
					}),
				},
			);

			if (!response.ok) {
				throw new Error(`GraphQL request failed: ${response.statusText}`);
			}

			const result = await response.json();
			if (result.errors) {
				throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
			}

			return result;
		},
	},
	{
		name: "graphql_post",
		description: "Look up a Post.",
		inputSchema: z.object({
			first: z.number().optional().default(10),
			after: z.string().optional(),
			before: z.string().optional(),
			last: z.number().optional(),
		}),
		outputSchema: z.object({
			data: z.object({
				post: z.object({
					edges: z.array(
						z.object({
							node: postNodeSchema,
						}),
					),
				}),
			}),
		}),
		fn: async (args) => {
			const query = `
					query post($first: Int, $after: String, $before: String, $last: Int) {
						post(first: $first, after: $after, before: $before, last: $last) {
							edges {
								node {
									commentsCount
									description
									id
									isCollected
									isVoted
									name
									reviewsCount
									reviewsRating
									slug
									tagline
									url
									userId
									votesCount
									website
								}
							}
						}
					}
				`;

			const response = await fetch(
				"https://api.producthunt.com/v2/api/graphql",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`,
					},
					body: JSON.stringify({
						query,
						variables: args,
					}),
				},
			);

			if (!response.ok) {
				throw new Error(`GraphQL request failed: ${response.statusText}`);
			}

			const result = await response.json();
			if (result.errors) {
				throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
			}

			return result;
		},
	},
	{
		name: "graphql_posts",
		description: "Look up Posts by various parameters.",
		inputSchema: z.object({
			first: z.number().optional().default(10),
			after: z.string().optional(),
			before: z.string().optional(),
			last: z.number().optional(),
		}),
		outputSchema: z.object({
			data: z.object({
				posts: z.object({
					edges: z.array(
						z.object({
							node: postNodeSchema,
						}),
					),
				}),
			}),
		}),
		fn: async (args) => {
			const query = `
					query posts($first: Int, $after: String, $before: String, $last: Int) {
						posts(first: $first, after: $after, before: $before, last: $last) {
							edges {
								node {
									commentsCount
									description
									id
									isCollected
									isVoted
									name
									reviewsCount
									reviewsRating
									slug
									tagline
									url
									userId
									votesCount
									website
								}
							}
						}
					}
				`;

			const response = await fetch(
				"https://api.producthunt.com/v2/api/graphql",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`,
					},
					body: JSON.stringify({
						query,
						variables: args,
					}),
				},
			);

			if (!response.ok) {
				throw new Error(`GraphQL request failed: ${response.statusText}`);
			}

			const result = await response.json();
			if (result.errors) {
				throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
			}

			return result;
		},
	},
	{
		name: "graphql_topic",
		description: "Look up a Topic.",
		inputSchema: z.object({
			first: z.number().optional().default(10),
			after: z.string().optional(),
			before: z.string().optional(),
			last: z.number().optional(),
		}),
		outputSchema: z.object({
			data: z.object({
				topic: z.object({
					edges: z.array(
						z.object({
							node: topicNodeSchema,
						}),
					),
				}),
			}),
		}),
		fn: async (args) => {
			const query = `
					query topic($first: Int, $after: String, $before: String, $last: Int) {
						topic(first: $first, after: $after, before: $before, last: $last) {
							edges {
								node {
									description
									followersCount
									id
									image
									isFollowing
									name
									postsCount
									slug
									url
								}
							}
						}
					}
				`;

			const response = await fetch(
				"https://api.producthunt.com/v2/api/graphql",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`,
					},
					body: JSON.stringify({
						query,
						variables: args,
					}),
				},
			);

			if (!response.ok) {
				throw new Error(`GraphQL request failed: ${response.statusText}`);
			}

			const result = await response.json();
			if (result.errors) {
				throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
			}

			return result;
		},
	},
	{
		name: "graphql_topics",
		description: "Look up Topics by various parameters.",
		inputSchema: z.object({
			first: z.number().optional().default(10),
			after: z.string().optional(),
			before: z.string().optional(),
			last: z.number().optional(),
		}),
		outputSchema: z.object({
			data: z.object({
				topics: z.object({
					edges: z.array(
						z.object({
							node: topicNodeSchema,
						}),
					),
				}),
			}),
		}),
		fn: async (args) => {
			const query = `
					query topics($first: Int, $after: String, $before: String, $last: Int) {
						topics(first: $first, after: $after, before: $before, last: $last) {
							edges {
								node {
									description
									followersCount
									id
									image
									isFollowing
									name
									postsCount
									slug
									url
								}
							}
						}
					}
				`;

			const response = await fetch(
				"https://api.producthunt.com/v2/api/graphql",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`,
					},
					body: JSON.stringify({
						query,
						variables: args,
					}),
				},
			);

			if (!response.ok) {
				throw new Error(`GraphQL request failed: ${response.statusText}`);
			}

			const result = await response.json();
			if (result.errors) {
				throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
			}

			return result;
		},
	},
	{
		name: "graphql_user",
		description: "Look up a User.",
		inputSchema: z.object({
			first: z.number().optional().default(10),
			after: z.string().optional(),
			before: z.string().optional(),
			last: z.number().optional(),
		}),
		outputSchema: z.object({
			data: z.object({
				user: z.object({
					edges: z.array(
						z.object({
							node: userNodeSchema,
						}),
					),
				}),
			}),
		}),
		fn: async (args) => {
			const query = `
					query user($first: Int, $after: String, $before: String, $last: Int) {
						user(first: $first, after: $after, before: $before, last: $last) {
							edges {
								node {
									coverImage
									headline
									id
									isFollowing
									isMaker
									isViewer
									name
									profileImage
									twitterUsername
									url
									username
									websiteUrl
								}
							}
						}
					}
				`;

			const response = await fetch(
				"https://api.producthunt.com/v2/api/graphql",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`,
					},
					body: JSON.stringify({
						query,
						variables: args,
					}),
				},
			);

			if (!response.ok) {
				throw new Error(`GraphQL request failed: ${response.statusText}`);
			}

			const result = await response.json();
			if (result.errors) {
				throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
			}

			return result;
		},
	},
	{
		name: "graphql_viewer",
		description: "Top level scope for currently authenticated user.",
		inputSchema: z.object({
			first: z.number().optional().default(10),
			after: z.string().optional(),
			before: z.string().optional(),
			last: z.number().optional(),
		}),
		outputSchema: z.object({
			data: z.object({
				viewer: z.object({
					edges: z.array(
						z.object({
							node: viewerNodeSchema,
						}),
					),
				}),
			}),
		}),
		fn: async (args) => {
			const query = `
					query viewer($first: Int, $after: String, $before: String, $last: Int) {
						viewer(first: $first, after: $after, before: $before, last: $last) {
							edges {
								node {
									
								}
							}
						}
					}
				`;

			const response = await fetch(
				"https://api.producthunt.com/v2/api/graphql",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`,
					},
					body: JSON.stringify({
						query,
						variables: args,
					}),
				},
			);

			if (!response.ok) {
				throw new Error(`GraphQL request failed: ${response.statusText}`);
			}

			const result = await response.json();
			if (result.errors) {
				throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
			}

			return result;
		},
	},
];
