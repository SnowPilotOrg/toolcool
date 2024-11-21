import { Card, CardBody } from "@nextui-org/card";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { ToolCall, toolChat } from "~/server/chat";
import type { MessageType } from "~/lib/types";
import { LoadingMessage, Message } from "~/components/message";
import { ArrowUpIcon, RefreshCcwIcon, XIcon } from "lucide-react";
import { Placeholder } from "./placeholder";
import { Recommendations } from "./recommendations";

export const ChatWindow = () => {
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [inputText, setInputText] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSend = async (prompt?: string) => {
		// TODO: this is a bit of a hack to avoid mutating the original messages array
		const localMessages = [...messages];
		const messageText = prompt || inputText;
		if (!messageText.trim()) return;

		const newMessage = {
			content: messageText,
			role: "user" as const,
		};

		localMessages.push(newMessage);
		setMessages((prev) => [...prev, newMessage]);
		setInputText("");
		setIsLoading(true);

		const response = await toolChat({
			data: { messages: localMessages },
		});
		if (response) {
			localMessages.push(response as MessageType);
			setMessages((prev) => [...prev, response as MessageType]);
		}
		if (response?.tool_calls) {
			const toolCallResults = await Promise.all(
				response.tool_calls.map((toolCall) =>
					ToolCall({
						data: { tool_call: toolCall },
					}),
				),
			);
			localMessages.push(...(toolCallResults as MessageType[]));
			setMessages((prev) => [...prev, ...(toolCallResults as MessageType[])]);
			console.log("localMessages", localMessages);
			// TODO: might want to do this recursively
			const res2 = await toolChat({
				data: {
					messages: localMessages,
				},
			});
			if (res2) {
				localMessages.push(res2 as MessageType);
				setMessages((prev) => [...prev, res2 as MessageType]);
			}
		}
		setIsLoading(false);
	};

	const handleReset = () => {
		setMessages([]);
		setInputText("");
	};

	return (
		<Card className="w-full max-w-2xl  h-[600px] max-h-screen flex flex-col relative">
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
			<CardBody className="p-4 flex flex-col gap-2">
				<ScrollShadow className="flex-grow">
					<div className="flex flex-col gap-3">
						{messages.map((message, index) => (
							<Message
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								message={message}
							/>
						))}
						{isLoading && <LoadingMessage />}
					</div>
					{messages.length === 0 && (
						<div className="flex justify-center items-center h-full">
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
