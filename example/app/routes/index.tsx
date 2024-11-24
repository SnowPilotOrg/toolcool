import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@nextui-org/react";
import { createFileRoute } from "@tanstack/react-router";

import { Background } from "~/components/background";
import { ChatWindow } from "~/components/chat-window";

export const Route = createFileRoute("/")({
	component: Home,
});

const code = `import { hackerNewsTools } from "@snowpilot/toolcool";

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
		<Background className="flex size-full items-center justify-center">
			<div className="flex size-full max-w-2xl flex-col items-center gap-4 py-2">
				<div className="flex w-full shrink-0 justify-between gap-2">
					<div className="flex flex-col gap-2">
						<h1 className="font-bold text-2xl">Toolcool</h1>
						<p className="text-gray-500 text-sm">Tool calling for every API</p>
					</div>
					<Button
						startContent={<FontAwesomeIcon icon={faGithub} />}
						variant="light"
						//TODO: Add link to the repo
						href="https://github.com/SnowPilotOrg/toolcool"
					>
						SnowPilotOrg/toolcool
					</Button>
				</div>
				<ChatWindow className="h-full" />
			</div>
		</Background>
	);
}
