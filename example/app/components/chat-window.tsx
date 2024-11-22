import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { ArrowUpIcon, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";
import { LoadingMessage, Message } from "~/components/message";
import type { MessageType } from "~/lib/types";
import { ToolCall, toolChat } from "~/server/chat";
import { Placeholder } from "./placeholder";
import { Recommendations } from "./recommendations";

export const ChatWindow = () => {
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [inputText, setInputText] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSend = async (prompt?: string) => {
		const messageText = prompt || inputText;
		if (!messageText.trim()) return;

		const newMessage = {
			content: messageText,
			role: "user" as const,
		};

		setMessages(prev => [...prev, newMessage]);
		setInputText("");
		setIsLoading(true);

		try {
			const initialResponse = await toolChat({
				data: { messages: [...messages, newMessage] },
			});
			
			if (initialResponse) {
				setMessages(prev => [...prev, initialResponse as MessageType]);
			}

			if (initialResponse?.tool_calls) {
				console.log("tool calls", initialResponse.tool_calls);

				const toolCallResults = await Promise.all(
					initialResponse.tool_calls.map((toolCall) =>
						ToolCall({
							data: { tool_call: toolCall },
						}),
					),
				) as MessageType[];
				
				setMessages(prev => [...prev, ...toolCallResults]);

				// Get AI's response to the tool call results
				const followUpResponse = await toolChat({
					data: {
						messages: [
							...messages,
							newMessage,
							initialResponse as MessageType,
							...toolCallResults
						],
					},
				});

				if (followUpResponse) {
					setMessages(prev => [...prev, followUpResponse as MessageType]);
				}
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleReset = () => {
		setMessages([]);
		setInputText("");
	};

	return (
		<Card className="relative flex h-[600px] max-h-screen w-full max-w-2xl flex-col">
			{messages.length > 0 && (
				<Button
					isIconOnly
					size="sm"
					variant="light"
					className="absolute top-4 left-4 z-10"
					onClick={handleReset}
				>
					<RefreshCcwIcon size={16} />
				</Button>
			)}
			<CardBody className="flex flex-col gap-2 p-4">
				<ScrollShadow className="flex-grow">
					<div className="flex flex-col gap-3">
						{messages.map((message, index) => (
							<Message
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								message={message}
								loading={isLoading}
							/>
						))}
						{isLoading && <LoadingMessage />}
					</div>
					{messages.length === 0 && (
						<div className="flex h-full items-center justify-center">
							{<Placeholder />}
						</div>
					)}
				</ScrollShadow>
				<Recommendations handleSend={handleSend} />
				<div>
					<Input
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						placeholder="Type a message..."
						onKeyDown={(e) => {
							if (e.key === "Enter") handleSend();
						}}
						className="flex-grow"
						variant="bordered"
						size="lg"
						endContent={
							<Button
								isIconOnly
								size="sm"
								variant="solid"
								radius="full"
								onClick={() => handleSend()}
								color="primary"
							>
								<ArrowUpIcon />
							</Button>
						}
					/>
				</div>
			</CardBody>
		</Card>
	);
};
