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

export const toolChat = createServerFn()
	.validator(
		z.object({
			messages: openAiMessagesSchema,
		}),
	)
	.handler(async (ctx) => {
		console.log("chat", ctx.data.messages[2]);

		try {
			const chatCompletion = await openai.chat.completions.create({
				messages: ctx.data.messages.map((msg) => ({
					role: msg.role,
					content: msg.content,
					tool_calls: msg.tool_calls,
					// @warrenbhw: this really tripped me up
					tool_call_id: msg.tool_call_id,
				})) as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
				model: "gpt-4o-mini",
				tools: toOpenAIFormat(tools),
				tool_choice: "auto",
				n: 1,
			});

			return chatCompletion.choices[0].message;
		} catch (error) {
			//TODO: handle error
			console.log(error);
		}
	});

// TODO: stream the response in the original message
export const ToolCall = createServerFn()
	.validator(
		z.object({
			tool_call: toolCallSchema,
		}),
	)
	.handler(async (ctx) => {
		const result = await callTools(tools, [ctx.data.tool_call]);
		return {
			role: "tool",
			content: JSON.stringify(result),
			tool_call_id: ctx.data.tool_call.id,
		};
	});
