import type { ChatCompletionTool } from "openai/resources/chat/completions";
import type { z } from "zod";
import zodToJsonSchema, {
	type JsonSchema7ObjectType,
	type JsonSchema7Type,
} from "zod-to-json-schema";

/**
 * Define an OpenAI Function call using zod instead of JSON schema.
 */
export type ZodFunctionDef<Parameters = Record<string, unknown>> = {
	/** Function name. */
	name: string;

	/** A description of what the function does. */
	description: string;

	/** Zod schema defining the function's parameters, to convert to JSON schema. */
	schema: z.ZodType<Parameters>;

	/** The endpoint to call. */
	endpoint: string;

	/** The endpoint to call. */
	endpoint_end?: string | undefined;
};

/**
 * OpenAI expects function definitions to use this JSON Schema format.
 */
type JsonSchemaFunctionDef = {
	name: string;
	description?: string;
	parameters: {
		type: "object";
		properties: Record<string, JsonSchema7Type>;
		required: string[] | undefined;
	};
};

/**
 * Convert a ZodFunctionDef to JSON Schema.
 */
export function toJsonSchema(
	functionDef: ZodFunctionDef,
): JsonSchemaFunctionDef {
	const { name, description, schema } = functionDef;

	const jsonSchema = zodToJsonSchema(schema) as JsonSchema7ObjectType;

	const { type, properties, required } = jsonSchema;

	return {
		name,
		description,
		parameters: {
			type,
			properties,
			required,
		},
	};
}

/**
 * Convert a ZodFunctionDef to the newer OpenAI tool format.
 */
export function toTool(functionDef: ZodFunctionDef): ChatCompletionTool {
	return {
		type: "function",
		function: toJsonSchema(functionDef),
	};
}
