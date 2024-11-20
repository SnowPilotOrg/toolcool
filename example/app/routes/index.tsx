
import { createFileRoute, useRouter } from "@tanstack/react-router";

import { Button } from "@nextui-org/button";
import { Background } from "../components/background";
import { ChatWindow } from "../components/chat-window";
import { Selector } from "../components/selector";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {

	return (
		<Background className="flex justify-center items-center">
			<div className="flex flex-col gap-4 w-full max-w-2xl">
				<Selector />
				<ChatWindow />
			</div>
		</Background>
	);
}
