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
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

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
	.handler(async ({ data }) => {
		const messagesToSend = data.messages.map((msg) => ({
			role: msg.role,
			content: msg.content,
			tool_calls: msg.tool_calls,
			tool_call_id: msg.tool_call_id,
		})) as ChatCompletionMessageParam[];

		try {
			const chatCompletion = await openai.chat.completions.create({
				messages: messagesToSend,
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

export const ToolCall = createServerFn({
	method: "POST",
})
	.validator(
		z.object({
			tool_call: toolCallSchema,
		}).parse,
	)
	.handler(async ({ data }) => {
		const result = await callTools(tools, [data.tool_call]);
		return {
			role: "tool",
			content: JSON.stringify(result),
			tool_call_id: data.tool_call.id,
		};
	});
