import { test, expect } from "bun:test";
import { ToolCool } from '../src';
import { HackerNewsProvider } from '../src/hacker-news';
import { OpenAI } from 'openai';

test("ToolCool E2E - should discover tools and execute OpenAI tool calls", async () => {
  const toolCool = new ToolCool();
  const openai = new OpenAI();

  // Register providers
  toolCool.registerProvider(new HackerNewsProvider());

  // Discover and register tools
  const tools = await toolCool.discoverTools({
    providers: ["hacker-news"],
  });

  toolCool.registerTools([
    ...tools,
    {
      name: "myInternalTool",
      description: "This is my internal tool",
      fn: async () => {
        return "Hello, world!";
      },
    },
  ]);

  // First message to get HN stories
  const response1 = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ 
      role: "user", 
      content: "Use getTopStories to fetch 2 Hacker News stories." 
    }],
    tools: toolCool.openaiTools(),
    tool_choice: "auto",
  });

  console.log('First OpenAI Response:', JSON.stringify(response1.choices[0].message, null, 2));
  
  const firstResults = await toolCool.executeToolCalls(
    response1.choices[0].message.tool_calls || []
  );

  // Second message to use internal tool
  const response2 = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { 
        role: "user", 
        content: "Now use myInternalTool to say hello." 
      }
    ],
    tools: toolCool.openaiTools(),
    tool_choice: "auto",
  });

  console.log('Second OpenAI Response:', JSON.stringify(response2.choices[0].message, null, 2));

  const secondResults = await toolCool.executeToolCalls(
    response2.choices[0].message.tool_calls || []
  );

  const allResults = [...firstResults, ...secondResults];
  console.log('All tool execution results:', allResults);

  // Assertions
  expect(allResults).toBeDefined();
  expect(allResults.length).toBeGreaterThan(1);
  
  // Verify HN stories were fetched
  const hnResult = allResults.find(r => Array.isArray(r));
  expect(hnResult).toBeDefined();
  if (Array.isArray(hnResult)) {
    expect(hnResult.length).toBeLessThanOrEqual(2);
    expect(hnResult[0]).toHaveProperty('title');
    expect(hnResult[0]).toHaveProperty('url');
  }

  // Verify internal tool was called
  const helloResult = allResults.find(r => r === "Hello, world!");
  expect(helloResult).toBeDefined();
});
