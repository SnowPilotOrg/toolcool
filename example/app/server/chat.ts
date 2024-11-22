import {
	callTools,
	hackerNewsTools,
	productHuntTools,
	toOpenAIFormat,
} from "@snowpilot/toolcool";
import { createServerFn } from "@tanstack/start";
import OpenAI from "openai";
import { z } from "zod";
import { openAiMessagesSchema, toolCallSchema } from "../lib/types";

const tools = [...hackerNewsTools, ...productHuntTools];
const openai = new OpenAI();

export const toolChat = createServerFn({
	method: "POST",
})
	.validator(
		z.object({
			messages: openAiMessagesSchema,
		}).parse,
	)
	.handler(async ({ data: { messages } }) => {
		try {
			const chatCompletion = await openai.chat.completions.create({
				messages,
				model: "gpt-4o-mini",
				tools: toOpenAIFormat(tools),
				tool_choice: "auto",
				n: 1,
			});

			return chatCompletion.choices[0].message;
		} catch (error) {
			return {
				error: {
					message:
						error instanceof Error ? error.message : "Chat completion failed",
				},
			};
		}
	});

export const callTool = createServerFn({
	method: "POST",
})
	.validator(
		z.object({
			tool_call: toolCallSchema,
		}).parse,
	)
	.handler(async ({ data: { tool_call } }) => {
		const result = await callTools(tools, [tool_call]);
		return {
			role: "tool",
			content: JSON.stringify(result),
			tool_call_id: tool_call.id,
		};
	});
