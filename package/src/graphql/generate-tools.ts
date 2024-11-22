import { type FieldDefinitionNode, Kind, type TypeNode, parse } from "graphql";
import { z } from "zod";
import type { Tool } from "../index";

interface GraphQLConfig {
	endpoint: string;
	getHeaders: () => Record<string, string>;
}

async function executeGraphQLQuery(
	config: GraphQLConfig,
	query: string,
	variables: Record<string, unknown>,
) {
	const response = await fetch(config.endpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...config.getHeaders(),
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

function generateZodSchema(type: TypeNode): z.ZodTypeAny {
	if (type.kind === Kind.NON_NULL_TYPE) {
		return generateZodSchema(type.type);
	}

	if (type.kind === Kind.LIST_TYPE) {
		return z.array(generateZodSchema(type.type));
	}

	if (type.kind === Kind.NAMED_TYPE) {
		switch (type.name.value) {
			case "String":
				return z.string();
			case "Int":
				return z.number().int();
			case "Float":
				return z.number();
			case "Boolean":
				return z.boolean();
			case "ID":
				return z.string();
			default:
				return z.object({}).passthrough(); // For complex types
		}
	}

	return z.any();
}

function generateArgString(args: Record<string, unknown>): string {
	const usedArgs = Object.entries(args).filter(
		([_, value]) => value !== undefined,
	);
	if (!usedArgs.length) return "";

	const argStrings = usedArgs.map(([key]) => `${key}: $${key}`);
	return `(${argStrings.join(", ")})`;
}

function generateVariableDefinitions(
	field: FieldDefinitionNode,
	usedVariables: string[],
): string {
	if (!field.arguments?.length) return "";

	const args = field.arguments
		.filter((arg) => usedVariables.includes(arg.name.value))
		.map((arg) => `$${arg.name.value}: ${getGraphQLType(arg.type)}`);

	return args.length ? `(${args.join(", ")})` : "";
}

function getGraphQLType(type: TypeNode): string {
	if (type.kind === Kind.NON_NULL_TYPE) {
		return `${getGraphQLType(type.type)}!`;
	}
	if (type.kind === Kind.LIST_TYPE) {
		return `[${getGraphQLType(type.type)}]`;
	}
	return type.name.value;
}

export function generateToolsFromSchema(
	schemaString: string,
	config: GraphQLConfig,
): Tool[] {
	const ast = parse(schemaString);
	const tools: Tool[] = [];

	// Find the Query type
	const queryType = ast.definitions.find(
		(def) =>
			def.kind === Kind.OBJECT_TYPE_DEFINITION && def.name.value === "Query",
	);

	if (!queryType || queryType.kind !== Kind.OBJECT_TYPE_DEFINITION) {
		throw new Error("No Query type found in schema");
	}

	// Generate a tool for each query field
	for (const field of queryType.fields || []) {
		const fieldName = field.name.value;

		// Generate input schema from arguments
		const argFields: Record<string, z.ZodTypeAny> = {};
		for (const arg of field.arguments || []) {
			// Only include pagination and basic filtering arguments
			if (["first", "after", "before", "last"].includes(arg.name.value)) {
				argFields[arg.name.value] = generateZodSchema(arg.type);
			}
		}

		// Generate output schema from return type
		const outputSchema = z.object({
			data: z.object({
				[fieldName]: z.object({
					edges: z.array(
						z.object({
							node: z
								.object({
									id: z.string(),
								})
								.passthrough(),
						}),
					),
				}),
			}),
		});

		const tool: Tool = {
			name: `graphql_${fieldName}`,
			description:
				field.description?.value || `Query ${fieldName} from GraphQL API`,
			inputSchema: z.object(argFields),
			outputSchema,
			fn: async (args) => {
				const usedVariables = Object.keys(args).filter(
					(key) => args[key] !== undefined,
				);
				const query = `
          query ${fieldName}${generateVariableDefinitions(field, usedVariables)} {
            ${fieldName}${generateArgString(args)} {
              edges {
                node {
                  id
                }
              }
            }
          }
        `;

				return executeGraphQLQuery(config, query, args);
			},
		};

		tools.push(tool);
	}

	return tools;
}
