import type {
	ChatCompletionMessageToolCall,
	ChatCompletionTool,
} from "openai/resources/chat/completions";
import type { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export * from "./providers";

export type Tool<
	TInput extends z.ZodSchema = z.ZodSchema,
	TOutput extends z.ZodSchema = z.ZodSchema,
> = {
	name: string;
	description: string;
	inputSchema: TInput;
	outputSchema: TOutput;
	fn: (args: z.infer<TInput>) => Promise<z.infer<TOutput>>;
};

export interface ToolProvider {
	name: string;
	tools: Tool[];
}

function toolToOpenAIFormat(tool: Tool): ChatCompletionTool {
	const jsonSchema = zodToJsonSchema(tool.inputSchema);
	// console.debug("jsonSchema", jsonSchema);

	return {
		type: "function",
		function: {
			parameters: jsonSchema,
			description: tool.description,
			name: tool.name,
		},
	};
}

export function toOpenAIFormat(tools: Tool[]): ChatCompletionTool[] {
	return tools.map(toolToOpenAIFormat);
}

export async function callTools(
	tools: Tool[],
	toolCalls: ChatCompletionMessageToolCall[],
): Promise<unknown[]> {
	const toolMap = new Map(tools.map((t) => [t.name, t]));

	return Promise.all(
		toolCalls.map((call) => {
			const tool = toolMap.get(call.function.name);
			if (!tool) {
				throw new Error(`Tool ${call.function.name} not found`);
			}
			const args = JSON.parse(call.function.arguments);
			return tool.fn(args);
		}),
	);
}
