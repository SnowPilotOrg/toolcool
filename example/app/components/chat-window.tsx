import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { toolChat } from "../server/chat";
import type { messagesSchema } from "../lib/types";
import type { z } from "zod";

export const ChatWindow = () => {
	const [messages, setMessages] = useState<z.infer<typeof messagesSchema>>([]);
	const [inputText, setInputText] = useState("");

	const handleSend = async () => {
		if (!inputText.trim()) return;

		const newMessage = {
			content: inputText,
			role: "user" as const,
		};

		setMessages((prev) => [...prev, newMessage]);
		setInputText("");
		const response = await toolChat({
			data: { messages: [...messages, newMessage] }
		});
		if (response?.content) {
			setMessages((prev) => [...prev, {
				role: "assistant",
				content: response.content as string
			}]);
		}
	};

	return (
		<Card className="w-full max-w-2xl h-2xl flex flex-col">
			<CardHeader className="border-b border-divider">
				<h4 className="text-lg font-semibold">Chat Interface</h4>
			</CardHeader>
			<CardBody className="p-4 flex flex-col gap-4">
				<ScrollShadow className="flex-grow">
					<div className="flex flex-col gap-3">
						{messages.map((message, index) => (
							<div
								key={index}
								className={`flex ${
									message.role === "user"
										? "justify-end"
										: "justify-start"
								}`}
							>
								<div
									className={`px-4 py-2 rounded-lg max-w-[80%] ${
										message.role === "user"
											? "bg-primary text-primary-foreground"
											: "bg-default-100"
									}`}
								>
									{message.content}
								</div>
							</div>
						))}
					</div>
				</ScrollShadow>
				<div className="flex gap-2">
					<Input
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						placeholder="Type a message..."
						onKeyDown={(e) => {
							if (e.key === "Enter") handleSend();
						}}
						className="flex-grow"
					/>
					<Button onClick={handleSend}>Send</Button>
				</div>
			</CardBody>
		</Card>
	);
}
