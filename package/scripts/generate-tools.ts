import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { generateToolsFromSchema } from "../src/graphql/generate-tools";
import { readFileSync } from "node:fs";

async function generateTools() {
	// First fetch the schema using our existing script
	const fetchProcess = Bun.spawn(["bun", "run", "scripts/fetch-schema.ts"], {
		stdout: "inherit",
		stderr: "inherit",
	});
	await fetchProcess.exited;

	// Now read the schema file that was just generated
	const schemaString = readFileSync(
		join(process.cwd(), "schema.graphql"),
		"utf-8",
	);

	// Generate the tools
	const config = {
		endpoint: "https://api.producthunt.com/v2/api/graphql",
		getHeaders: () => ({
			Authorization: `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`,
		}),
	};

	const tools = generateToolsFromSchema(schemaString, config);

	// Write the generated tools
	const output = `
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
	${tools.map(tool => `{
		name: "${tool.name}",
		description: "${tool.description}",
		inputSchema: z.object({
			first: z.number().optional().default(10),
			after: z.string().optional(),
			before: z.string().optional(),
			last: z.number().optional()
		}),
		outputSchema: z.object({
			data: z.object({
				${tool.name.replace('graphql_', '')}: z.object({
					edges: z.array(
						z.object({
							node: nodeSchema
						})
					)
				})
			})
		}),
		fn: async (args) => {
			const query = \`
				query ${tool.name.replace('graphql_', '')}($first: Int, $after: String, $before: String, $last: Int) {
					${tool.name.replace('graphql_', '')}(first: $first, after: $after, before: $before, last: $last) {
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
			\`;

			const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": \`Bearer \${process.env.PRODUCT_HUNT_API_TOKEN}\`
				},
				body: JSON.stringify({
					query,
					variables: args
				})
			});

			if (!response.ok) {
				throw new Error(\`GraphQL request failed: \${response.statusText}\`);
			}

			const result = await response.json();
			if (result.errors) {
				throw new Error(\`GraphQL errors: \${JSON.stringify(result.errors)}\`);
			}

			return result;
		}
	}`).join(",\n  ")}
];`;

	writeFileSync(
		join(process.cwd(), "src/providers/product-hunt/tools.generated.ts"),
		output,
	);
}

generateTools().catch(console.error);
