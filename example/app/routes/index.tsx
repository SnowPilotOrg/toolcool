import { createFileRoute, useRouter } from "@tanstack/react-router";

import { Button } from "@nextui-org/button";
import { Background } from "../components/background";
import { ChatWindow } from "../components/chat-window";
import { Selector } from "../components/selector";
import { CodeBlock } from "../components/codeblock";

export const Route = createFileRoute("/")({
	component: Home,
});

const code = `import { hackerNewsTools } from "snowpilot/toolcool";

const chatCompletion = await client.chat.completions.create(
	{
		messages,
		model: "gpt-4o-mini",
		tools: [hackerNewsTools],
		n: 1,
	});

return chatCompletion.choices[0].message;`;

function Home() {
	return (
		<Background className="flex justify-center items-center">
			<div className="flex flex-col gap-4 w-full max-w-2xl">
				<Selector />
				<ChatWindow />
				<CodeBlock code={code} />
			</div>
		</Background>
	);
}
