# tool-cool

Zod schemas to simplify tool calls for popular SaaS APIs
View package on [npm](https://www.npmjs.com/package/@snowpilot/tool-cool)

To consume this package with npm:

```bash
npm install @snowpilot/tool-cool
```

Usage example:

```typescript
import { callTools, discoverTools, toOpenAIFormat } from "@snowpilot/tool-cool";
import OpenAI from "openai";

const openai = new OpenAI();

const tools = await discoverTools(["hacker-news"]);

// Get top Hacker News stories
const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
        {
            role: "user",
            content: "Use getTopStories to fetch 2 Hacker News stories.",
        },
    ],
    tools: toOpenAIFormat(...tools),
    tool_choice: "auto",
});

const results = await callTools(
    tools,
    completion.choices[0].message.tool_calls || [],
);
```
