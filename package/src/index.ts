import type { ChatCompletionTool, ChatCompletionMessageToolCall } from "openai/resources/chat/completions";

// JSON Schema type for function parameters
export interface FunctionParameters {
  type: "object";
  properties: Record<string, {
    type: string;
    description?: string;
    default?: unknown;
    [key: string]: unknown;
  }>;
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

export class ToolCool {
  private tools: Map<string, Tool> = new Map();
  private providers: Map<string, ToolProvider> = new Map();

  registerProvider(provider: ToolProvider) {
    this.providers.set(provider.name, provider);
  }

  async discoverTools(options: { providers: string[] }) {
    const discoveredTools: Tool[] = [];
    
    for (const providerName of options.providers) {
      const provider = this.providers.get(providerName);
      if (!provider) {
        throw new Error(`Provider ${providerName} not found`);
      }
      
      const tools = await provider.discoverTools();
      discoveredTools.push(...tools);
    }
    
    return discoveredTools;
  }

  registerTools(tools: Tool[]) {
    for (const tool of tools) {
      this.tools.set(tool.name, tool);
    }
  }

  openaiTools(): ChatCompletionTool[] {
    return Array.from(this.tools.values()).map(tool => ({
      type: 'function' as const,
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters || { 
          type: 'object' as const,
          properties: {} 
        }
      }
    }));
  }

  async executeToolCalls(toolCalls: ChatCompletionMessageToolCall[]) {
    const results: unknown[] = [];
    
    for (const call of toolCalls) {
      const tool = this.tools.get(call.function.name);
      if (!tool) {
        throw new Error(`Tool ${call.function.name} not found`);
      }

      const args = JSON.parse(call.function.arguments);
      results.push(await tool.fn(args));
    }

    return results;
  }
} 