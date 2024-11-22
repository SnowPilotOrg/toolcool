import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
	type FieldDefinitionNode,
	Kind,
	type ObjectTypeDefinitionNode,
	buildClientSchema,
	parse,
	printSchema,
} from "graphql";

async function fetchSchema() {
	const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`,
		},
		body: JSON.stringify({
			query: `
				query IntrospectionQuery {
					__schema {
						queryType { name }
						mutationType { name }
						subscriptionType { name }
						types {
							...FullType
						}
						directives {
							name
							description
							locations
							args {
								...InputValue
							}
						}
					}
				}

				fragment FullType on __Type {
					kind
					name
					description
					fields(includeDeprecated: true) {
						name
						description
						args {
							...InputValue
						}
						type {
							...TypeRef
						}
						isDeprecated
						deprecationReason
					}
					inputFields {
						...InputValue
					}
					interfaces {
						...TypeRef
					}
					enumValues(includeDeprecated: true) {
						name
						description
						isDeprecated
						deprecationReason
					}
					possibleTypes {
						...TypeRef
					}
				}

				fragment InputValue on __InputValue {
					name
					description
					type {
						...TypeRef
					}
					defaultValue
				}

				fragment TypeRef on __Type {
					kind
					name
					ofType {
						kind
						name
						ofType {
							kind
							name
							ofType {
								kind
								name
								ofType {
									kind
									name
									ofType {
										kind
										name
										ofType {
											kind
											name
										}
									}
								}
							}
						}
					}
				}
			`,
		}),
	});

	const result = await response.json();
	if (result.errors) {
		throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
	}

	// Convert introspection result to SDL and write it
	const schema = buildClientSchema(result.data);
	const sdl = printSchema(schema);
	writeFileSync(join(process.cwd(), "schema.graphql"), sdl);
	return sdl;
}

function isScalarField(field: FieldDefinitionNode): boolean {
	let type = field.type;
	// Unwrap non-null and list types
	while (type.kind === Kind.NON_NULL_TYPE || type.kind === Kind.LIST_TYPE) {
		type = type.type;
	}
	// Check if it's a scalar type
	if (type.kind === Kind.NAMED_TYPE) {
		return ["String", "Int", "Float", "Boolean", "ID"].includes(
			type.name.value,
		);
	}
	return false;
}

function generateNodeSchema(type: ObjectTypeDefinitionNode): string {
	const fields = type.fields
		?.filter(isScalarField)
		?.map((field) => {
			const isRequired = field.type.kind === Kind.NON_NULL_TYPE;
			const baseType =
				field.type.kind === Kind.NON_NULL_TYPE ? field.type.type : field.type;

			let zodType = "z.string()";
			if (baseType.kind === Kind.NAMED_TYPE) {
				switch (baseType.name.value) {
					case "Int":
						zodType = "z.number().int()";
						break;
					case "Float":
						zodType = "z.number()";
						break;
					case "Boolean":
						zodType = "z.boolean()";
						break;
					case "ID":
						zodType = "z.string()";
						break;
					default:
						zodType = "z.string()";
				}
			}

			return `${field.name.value}: ${zodType}${isRequired ? "" : ".optional()"}`;
		})
		.filter(Boolean);

	return `z.object({
		${fields?.join(",\n		")}
	})`;
}

async function generateTools() {
	// Fetch and write schema
	const schemaString = await fetchSchema();

	// Parse schema to get type definitions
	const ast = parse(schemaString);
	const typeMap = new Map<string, ObjectTypeDefinitionNode>();

	// Build type map
	for (const def of ast.definitions) {
		if (def.kind === Kind.OBJECT_TYPE_DEFINITION) {
			typeMap.set(def.name.value, def);
		}
	}

	// Find Query type
	const queryType = ast.definitions.find(
		(def) =>
			def.kind === Kind.OBJECT_TYPE_DEFINITION && def.name.value === "Query",
	) as ObjectTypeDefinitionNode;

	if (!queryType) {
		throw new Error("No Query type found in schema");
	}

	// Generate node schemas for each type
	const nodeSchemas = Array.from(typeMap.entries())
		.filter(([name]) => !name.endsWith("Connection") && !name.endsWith("Edge"))
		.map(
			([name, type]) => `
const ${name.toLowerCase()}NodeSchema = ${generateNodeSchema(type)};`,
		)
		.join("\n");

	// Generate tools
	const tools = queryType.fields?.map((field) => {
		const fieldName = field.name.value;
		const returnTypeName =
			field.type.kind === Kind.NON_NULL_TYPE
				? field.type.type.name.value
				: field.type.name.value;
		const baseTypeName = returnTypeName.replace("Connection", "");
		const type = typeMap.get(baseTypeName);

		if (!type) {
			throw new Error(`Type ${baseTypeName} not found in schema`);
		}

		const scalarFields = type.fields
			?.filter(isScalarField)
			.map((f) => f.name.value);

		return `{
			name: "graphql_${fieldName}",
			description: ${JSON.stringify(
				field.description?.value || `Query ${fieldName} from GraphQL API`,
			)},
			inputSchema: z.object({
				first: z.number().optional().default(10),
				after: z.string().optional(),
				before: z.string().optional(),
				last: z.number().optional()
			}),
			outputSchema: z.object({
				data: z.object({
					${fieldName}: z.object({
						edges: z.array(
							z.object({
								node: ${baseTypeName.toLowerCase()}NodeSchema
							})
						)
					})
				})
			}),
			fn: async (args) => {
				const query = \`
					query ${fieldName}($first: Int, $after: String, $before: String, $last: Int) {
						${fieldName}(first: $first, after: $after, before: $before, last: $last) {
							edges {
								node {
									${scalarFields?.join("\n									")}
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
		}`;
	});

	// Write the generated file
	const output = `
// Generated file, do not edit directly

import { z } from "zod";
import type { Tool } from "../../index";

${nodeSchemas}

// Tool Definitions
export const productHuntTools: Tool[] = [
	${tools?.join(",\n	")}
];`;

	writeFileSync(
		join(process.cwd(), "src/providers/product-hunt/tools.generated.ts"),
		output,
	);
}

generateTools().catch(console.error);
