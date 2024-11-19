import { OpenAI } from "openai";
import { toTool } from "./lib/function";
import { itemFunctions } from "./connections/hacker-news";
import readline from "readline";

console.log("About to run some cool tools");

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const question = await new Promise<string>(resolve => rl.question("What do you want to know about Hacker News? ", resolve));

const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
	{
		role: "user" as const,
		content: question,
	},
];

const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages,

	// Convert ZodFunctions for OpenAI
	tools: itemFunctions.map(toTool),
});

const { message } = completion.choices[0];

console.log(message)

//TODO: parse the tool call
if (message.tool_calls) {
	console.log("tool calls", message.tool_calls);
	for (const toolCall of message.tool_calls) {
		const functionCall = toolCall.function;
		const functionDef = itemFunctions.find(f => f.name === functionCall.name);

		if (functionDef) {
			const args = JSON.parse(functionCall.arguments);
			const endpoint = functionDef.endpoint + (args.id || "") + (functionDef.endpoint_end || "");
			
			const response = await fetch(endpoint);
			const data = await response.json();
			
			console.log(data)
	}
}}
