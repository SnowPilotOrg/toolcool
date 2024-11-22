import { z } from "zod";
import type { SchemaTypes } from "./schema-parser";

export interface QueryBuilder {
	inputSchema: z.ZodObject<{
		fields: z.ZodArray<z.ZodEnum<[string, ...string[]]>>;
		[key: string]: z.ZodTypeAny;
	}>;
}

export interface QueryBuilders {
	[key: string]: QueryBuilder;
}

export function generateQueryBuilders(types: SchemaTypes): QueryBuilders {
	const builders: QueryBuilders = {};

	for (const [typeName, typeInfo] of Object.entries(types)) {
		const fieldNames = typeInfo.fields
			.filter((f) => !f.args?.length)
			.map((f) => f.name) as [string, ...string[]];

		builders[typeName] = {
			inputSchema: z.object({
				fields: z
					.array(z.enum(fieldNames))
					.describe("Fields to include in the response"),
				first: z.number().optional().describe("Number of items to fetch"),
				after: z.string().optional().describe("Cursor for pagination"),
				...generateTypeSpecificArgs(typeInfo),
			}) as QueryBuilder["inputSchema"],
		};
	}

	return builders;
}

function generateTypeSpecificArgs(typeInfo: SchemaTypes[string]) {
	const args: Record<string, z.ZodTypeAny> = {};

	if (typeInfo.fields.find((f) => f.name === "createdAt")) {
		args.createdAfter = z
			.string()
			.optional()
			.describe("Filter by creation date");
	}

	if (typeInfo.fields.find((f) => f.name === "featured")) {
		args.featured = z.boolean().optional().describe("Filter featured items");
	}

	return args;
}
