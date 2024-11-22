import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { ArrowUpIcon, RefreshCcwIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { LoadingMessage, Message } from "~/components/message";
import type { MessageType } from "~/lib/types";
import { ToolCall, toolChat } from "~/server/chat";
import { Placeholder } from "./placeholder";
import { Recommendations } from "./recommendations";

type ErrorResponse = {
	error: {
		message: string;
	};
};

function isErrorResponse(response: unknown): response is ErrorResponse {
	return (
		typeof response === "object" &&
		response !== null &&
		"error" in response &&
		typeof response.error === "object" &&
		response.error !== null &&
		"message" in response.error &&
		typeof response.error.message === "string"
	);
}

export const ChatWindow = () => {
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [inputText, setInputText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	const handleSend = async (prompt?: string) => {
		const messageText = prompt || inputText;
		if (!messageText.trim() || isLoading) return;

		const userMessage = {
			content: messageText,
			role: "user" as const,
		};

		try {
			setIsLoading(true);
			setError(null);
			setInputText("");

			// Add user message optimistically
			setMessages((prev) => [...prev, userMessage]);

			// Get initial response
			const initialResponse = await toolChat({
				method: "POST",
				data: { messages: [...messages, userMessage] },
			});

			if (!initialResponse || isErrorResponse(initialResponse)) {
				const errorMsg = isErrorResponse(initialResponse)
					? initialResponse.error.message
					: "No response received";
				throw new Error(errorMsg);
			}

			// Add assistant's response
			setMessages((prev) => [...prev, initialResponse as MessageType]);

			// Handle tool calls if any
			if (initialResponse.tool_calls?.length) {
				const errors: string[] = [];
				const toolResults: MessageType[] = [];

				// Process tool calls sequentially
				for (const toolCall of initialResponse.tool_calls) {
					try {
						const result = await ToolCall({
							method: "POST",
							data: { tool_call: toolCall },
						});

						if (isErrorResponse(result)) {
							errors.push(`${toolCall.function.name}: ${result.error.message}`);
							continue;
						}

						toolResults.push(result as MessageType);
					} catch (err) {
						errors.push(
							`${toolCall.function.name}: ${err instanceof Error ? err.message : "Failed"}`,
						);
					}
				}

				// Show any tool errors
				if (errors.length > 0) {
					setError(errors.join("\n"));
				}

				// If we got any successful results, use them
				if (toolResults.length > 0) {
					setMessages((prev) => [...prev, ...toolResults]);

					// Get final response
					try {
						const finalResponse = await toolChat({
							method: "POST",
							data: {
								messages: [
									...messages,
									userMessage,
									initialResponse as MessageType,
									...toolResults,
								],
							},
						});

						if (finalResponse && !isErrorResponse(finalResponse)) {
							setMessages((prev) => [...prev, finalResponse as MessageType]);
						}
					} catch (err) {
						// Don't throw here - we want to keep the successful tool results
						console.error("Final response error:", err);
					}
				}
			}
		} catch (error) {
			console.error("Chat error:", error);
			// Remove the user message since the request failed
			setMessages((prev) => prev.slice(0, -1));
			setError(
				error instanceof Error ? error.message : "An unexpected error occurred",
			);
		} finally {
			setIsLoading(false);
			scrollToBottom();
		}
	};

	const handleReset = () => {
		setMessages([]);
		setInputText("");
		setError(null);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
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
								key={`${message.role}-${index}-${message.content?.slice(0, 20)}`}
								message={message}
								loading={isLoading}
							/>
						))}
						{isLoading && <LoadingMessage />}
						{error && (
							<div className="whitespace-pre-wrap rounded-lg bg-danger-100 p-3 text-sm text-danger-700 border border-danger-200">
								❌ {error}
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>
					{messages.length === 0 && (
						<div className="flex h-full items-center justify-center">
							<Placeholder />
						</div>
					)}
				</ScrollShadow>
				<Recommendations handleSend={handleSend} />
				<div>
					<Input
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						placeholder="Type a message..."
						onKeyDown={handleKeyDown}
						disabled={isLoading}
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
								disabled={isLoading || !inputText.trim()}
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
