import { createFileRoute } from "@tanstack/react-router";

import { Background } from "~/components/background";
import { ChatWindow } from "~/components/chat-window";
import { Selector } from "~/components/selector";
import { CodeBlock } from "~/components/codeblock";
import { Banner } from "~/components/banner";

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
		<Background className="flex justify-center p-6 sm:pt-24">
			<div className="flex flex-col gap-12 w-full max-w-2xl">
				<Banner />
				<div className="flex flex-col gap-4">
					<ChatWindow />
					{/* <Selector /> */}
				</div>
				<div className="pb-12">
					<CodeBlock code={code} />
				</div>
			</div>
		</Background>
	);
}
