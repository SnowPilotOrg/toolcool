// const toolCool = new ToolCool();

// const tools = toolCool.discoverTools({
//     providers: ["hacker-news", "twitter"],
// });

// toolCool.registerTools([
//     ...tools,
//     {
//         name: "myInternalTool",
//         description: "This is my internal tool",
//         fn: async () => {
//             return "Hello, world!";
//         },
//     },
// ]);


// const openai = new OpenAI();

// const response = await openai.chat.completions.create({
//     messages: [{ role: "user", content: "What is the weather in Tokyo?" }],
//     tools: toolCool.openaiTools(),
// });

// await toolCool.executeToolCalls(response.choices[0].message.tool_calls);
