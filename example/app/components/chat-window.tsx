import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { toolChat } from "../server/chat";
import type { MessageType } from "../lib/types";
import { Message } from "./message";

export const ChatWindow = () => {
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [inputText, setInputText] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSend = async () => {
		if (!inputText.trim()) return;

		const newMessage = {
			content: inputText,
			role: "user" as const,
		};

		setMessages((prev) => [...prev, newMessage]);
		setInputText("");
		setIsLoading(true);
		const response = await toolChat({
			data: { messages: [...messages, newMessage] },
		});
		if (response?.content) {
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: response.content as string,
				},
			]);
		}
		setIsLoading(false);
	};

	const messagesWithLoading = [
		...messages,
		...(isLoading ? [{ role: "assistant", content: "", isLoading }] : []),
	];

	return (
		<Card className="w-full max-w-2xl h-2xl min-h-[400px] max-h-screen flex flex-col">
			<CardHeader className="border-b border-divider">
				<h4 className="text-lg font-semibold">Chat Interface</h4>
			</CardHeader>
			<CardBody className="p-4 flex flex-col gap-4">
				<ScrollShadow className="flex-grow">
					<div className="flex flex-col gap-3">
						{messagesWithLoading.map((message, index) => (
							<Message
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								role={message.role as "system" | "user" | "assistant"}
								content={message.content}
								isLoading={message.isLoading}
							/>
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
};