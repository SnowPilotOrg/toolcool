import type {
	ChatCompletionTool,
	ChatCompletionMessageToolCall,
} from "openai/resources/chat/completions";
import { getProviders } from "./providers";

// JSON Schema type for function parameters
export interface FunctionParameters {
	type: "object";
	properties: Record<
		string,
		{
			type: string;
			description?: string;
			default?: unknown;
			[key: string]: unknown;
		}
	>;
	required?: string[];
	[key: string]: unknown;
}

export interface Tool {
	name: string;
	description: string;
	parameters?: FunctionParameters;
	fn: (args: Record<string, unknown>) => Promise<unknown>;
}

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

export function toolsToOpenAIFormat(
	tools: Map<string, Tool>,
): ChatCompletionTool[] {
	return Array.from(tools.values()).map((tool) => ({
		type: "function" as const,
		function: {
			name: tool.name,
			description: tool.description,
			parameters: tool.parameters || {
				type: "object" as const,
				properties: {},
			},
		},
	}));
}

export async function executeToolCalls(
	tools: Map<string, Tool>,
	toolCalls: ChatCompletionMessageToolCall[],
): Promise<unknown[]> {
	const results: unknown[] = [];

	for (const call of toolCalls) {
		const tool = tools.get(call.function.name);
		if (!tool) {
			throw new Error(`Tool ${call.function.name} not found`);
		}

		const args = JSON.parse(call.function.arguments);
		results.push(await tool.fn(args));
	}

	return results;
}
