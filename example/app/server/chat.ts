import { createServerFn } from '@tanstack/start'
import OpenAI from 'openai';
import { z } from 'zod';
import { messagesSchema } from '../lib/types';

async function makeOpenAiClient(): Promise<OpenAI> {
	return new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});
}

export const toolChat = createServerFn()
	.validator(z.object({
		messages: messagesSchema,
	}))
.handler(async (ctx) => {
	const client = await makeOpenAiClient();

	try {
		const chatCompletion = await client.chat.completions.create({
			messages: ctx.data.messages,
			model: "gpt-4o-mini",
			// tools,
			n: 1,
		});
		return chatCompletion.choices[0].message;
	} catch (error) {
		//TODO: handle error
		console.log(error);
	}

})
