import type { ChatCompletionMessage } from "~/lib/types";
import type { ToolCall } from "~/lib/types";
import { callTool } from "~/server/chat";

export type ToolExecutionResult = {
	success: ChatCompletionMessage[];
	errors: string[];
};

export const toolService = {
	async executeToolCalls(toolCalls: ToolCall[]): Promise<ToolExecutionResult> {
		const results: ToolExecutionResult = {
			success: [],
			errors: [],
		};

		const promises = toolCalls.map(async (toolCall) => {
			try {
				const result = await callTool({
					data: { tool_call: toolCall },
				});

				if (
					"error" in result &&
					result.error &&
					typeof result.error === "object" &&
					"message" in result.error
				) {
					results.errors.push(
						`${toolCall.function.name}: ${result.error.message}`,
					);
					return;
				}

				results.success.push(result as ChatCompletionMessage);
			} catch (err) {
				results.errors.push(
					`${toolCall.function.name}: ${err instanceof Error ? err.message : "Failed"}`,
				);
			}
		});

		await Promise.all(promises);

		return results;
	},
};
