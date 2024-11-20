import { z } from "zod"

const openAiMessageSchema = z.object({
	role: z.enum(["system", "user", "assistant"]),
	content: z.string(),
})

export type MessageType = z.infer<typeof openAiMessageSchema> & {
	isLoading?: boolean;
};

export const openAiMessagesSchema = z.array(openAiMessageSchema)

