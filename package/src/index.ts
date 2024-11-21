import type {
	ChatCompletionTool,
	ChatCompletionMessageToolCall,
} from "openai/resources/chat/completions";
import { getProviders } from "./providers";
import type { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { getTopStoriesInput } from "./providers/hacker-news";

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
	discoverTools(): Promise<Tool[]> | Tool[];
}

export async function discoverTools(providerNames: string[]): Promise<Tool[]> {
	const discoveredTools: Tool[] = [];

	const providers = getProviders(providerNames);
	for (const provider of providers.values()) {
		const tools = await provider.discoverTools();
		discoveredTools.push(...tools);
	}

	return discoveredTools;
}

function toolToOpenAIFormat(tool: Tool): ChatCompletionTool {
	// console.log("input", tool.inputSchema);
	// console.log("output", tool.outputSchema);
	return {
		type: "function",
		function: {
			// parameters: zodToJsonSchema(tool.inputSchema, tool.name),
			// parameters: zodToJsonSchema(tool.inputSchema),
			parameters: zodToJsonSchema(getTopStoriesInput),
			description: tool.description,
			name: tool.name,
		},
	};
}

export function toOpenAIFormat(...tools: Tool[]): ChatCompletionTool[] {
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
