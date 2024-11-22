import type { MessageType } from '~/lib/types';
import { ToolCall } from '~/server/chat';
import type { ToolCallType } from '~/lib/types';

export type ToolExecutionResult = {
  success: MessageType[];
  errors: string[];
};

export const toolService = {
  async executeToolCalls(toolCalls: ToolCallType[]): Promise<ToolExecutionResult> {
    const results: ToolExecutionResult = {
      success: [],
      errors: []
    };

    for (const toolCall of toolCalls) {
      try {
        const result = await ToolCall({
          data: { tool_call: toolCall }
        });

        if ('error' in result) {
          results.errors.push(`${toolCall.function.name}: ${result.error.message}`);
          continue;
        }

        results.success.push(result as MessageType);
      } catch (err) {
        results.errors.push(
          `${toolCall.function.name}: ${err instanceof Error ? err.message : 'Failed'}`
        );
      }
    }

    return results;
  }
}; 