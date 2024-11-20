import { createServerFn } from "@tanstack/start";
import OpenAI from "openai";
import { z } from "zod";
import { openAiMessagesSchema } from "../lib/types";
import { callTools, discoverTools, toOpenAIFormat } from "@snowpilot/tool-cool";

async function makeOpenAiClient(): Promise<OpenAI> {
	return new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});
}

export const toolChat = createServerFn()
	.validator(
		z.object({
			messages: openAiMessagesSchema,
		}),
	)
	.handler(async (ctx) => {
		const client = await makeOpenAiClient();

		const hnTools = await discoverTools(["hacker-news"]);

		try {
			const chatCompletion = await client.chat.completions.create({
				messages: ctx.data.messages,
				model: "gpt-4o-mini",
				tools: toOpenAIFormat(...hnTools),
				tool_choice: "auto",
				n: 1,
			});

			const toolCalls = chatCompletion.choices[0].message.tool_calls;
			if (toolCalls) {
				const results = await callTools(hnTools, toolCalls);
				console.log("tool results", results);
			}

			return chatCompletion.choices[0].message;
		} catch (error) {
			//TODO: handle error
			console.log(error);
		}
	});
