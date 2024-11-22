import { z } from "zod";

export const ToolCall = z.object({
	id: z.string(),
	function: z.object({
		name: z.string(),
		arguments: z.string(),
	}),
	type: z.literal("function"),
});

export type ToolCall = z.infer<typeof ToolCall>;

export const ChatCompletionMessage = z.discriminatedUnion("role", [
	z.object({
		role: z.literal("tool"),
		content: z.string(),
		tool_call_id: z.string(),
	}),
	z.object({
		role: z.enum(["system", "user"]),
		content: z.string(),
		name: z.string().optional(),
	}),
	z.object({
		role: z.literal("assistant"),
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
		tool_calls: z.array(ToolCall).optional(),
		name: z.string().optional(),
	}),
]);

export type ChatCompletionMessage = z.infer<typeof ChatCompletionMessage>;

export type ErrorResponse = {
	error: {
		message: string;
	};
};
