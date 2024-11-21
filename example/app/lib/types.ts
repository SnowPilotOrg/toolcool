import { z } from "zod";

// TODO: should just get this from openai
export const toolCallSchema = z.object({
	function: z.object({
		name: z.string(),
		arguments: z.string(),
	}),
	type: z.literal("function"),
	id: z.string(),
});

export const openAiMessageSchema = z.object({
	role: z.enum(["system", "user", "assistant", "tool"]),
	content: z.string().nullable().optional(),
	refusal: z.string().nullable().optional(),
	audio: z
		.object({
			id: z.string(),
			data: z.string(),
			expires_at: z.number(),
			transcript: z.string(),
		})
		.nullable()
		.optional(),
	tool_calls: z.array(toolCallSchema).nullable().optional(),
	tool_call_id: z.string().nullable().optional(),
});

export type MessageType = z.infer<typeof openAiMessageSchema>;

export const openAiMessagesSchema = z.array(openAiMessageSchema);
