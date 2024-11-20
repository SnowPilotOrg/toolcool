
import { createFileRoute, useRouter } from "@tanstack/react-router";

import { Button } from "@nextui-org/button";
import { Background } from "../components/background";
import { ChatWindow } from "../components/chat-window";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {

	return (
		<Background className="flex justify-center items-center">
			
			<ChatWindow />
		</Background>
	);
}
