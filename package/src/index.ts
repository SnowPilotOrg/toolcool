import type {
	ChatCompletionTool,
	ChatCompletionMessageToolCall,
} from "openai/resources/chat/completions";
import { getProviders } from "./providers";

export * from "./providers";

export type JSONSchema = Record<string, unknown>;

export type Tool = {
	name: string;
	description: string;
	inputSchema: JSONSchema;
	outputSchema: JSONSchema;
	// TODO: figure out how to give this the typing matching
	// the input and output schema
	fn: (args: unknown) => Promise<unknown>;
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
	return {
		type: "function",
		function: {
			parameters: tool.inputSchema,
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
