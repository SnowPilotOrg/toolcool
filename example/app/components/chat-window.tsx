import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { ArrowUpIcon, RefreshCcwIcon } from "lucide-react";
import { useCallback, useRef } from "react";
import { LoadingMessage, Message } from "~/components/message";
import { config } from "~/config/chat";
import { useChatMessages } from "~/hooks/use-chat-messages";
import { useInput } from "~/hooks/use-input";
import { toolChat } from "~/server/chat";
import { toolService } from "~/services/toolService";
import { ChatErrorBoundary } from "./chat-error-boundary";
import { Placeholder } from "./placeholder";
import { Recommendations } from "./recommendations";

export const ChatWindow = () => {
	const {
		messages,
		isLoading,
		error,
		setIsLoading,
		setError,
		addMessage,
		addMessages,
		removeLastMessage,
		reset: resetMessages,
	} = useChatMessages();

	const {
		value: inputText,
		setValue: setInputText,
		reset: resetInput,
	} = useInput("");
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: config.ui.scrollBehavior,
		});
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
			resetInput();
			addMessage(userMessage);

			const initialResponse = await toolChat({
				data: { messages: [...messages, userMessage] },
			});

			if (!initialResponse || "error" in initialResponse) {
				throw new Error(
					"error" in initialResponse
						? initialResponse.error.message
						: "No response received",
				);
			}

			addMessage(initialResponse);

			if (initialResponse.tool_calls?.length) {
				const { success: toolResults, errors: toolErrors } =
					await toolService.executeToolCalls(initialResponse.tool_calls);

				if (toolErrors.length > 0) {
					setError(toolErrors.join("\n"));
				}

				if (toolResults.length > 0) {
					addMessages(toolResults);

					try {
						const finalResponse = await toolChat({
							data: {
								messages: [
									...messages,
									userMessage,
									initialResponse,
									...toolResults,
								],
							},
						});

						if (finalResponse && !("error" in finalResponse)) {
							addMessage(finalResponse);
						}
					} catch (err) {
						console.error("Final response error:", err);
					}
				}
			}
		} catch (error) {
			console.error("Chat error:", error);
			removeLastMessage();
			setError(
				error instanceof Error ? error.message : "An unexpected error occurred",
			);
		} finally {
			setIsLoading(false);
			scrollToBottom();
		}
	};

	const handleReset = useCallback(() => {
		resetMessages();
		resetInput();
	}, [resetMessages, resetInput]);

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
								key={`${message.role}-${index}-${message.content?.slice(0, config.ui.maxMessagePreviewLength)}`}
								message={message}
								loading={isLoading}
							/>
						))}
						{isLoading && <LoadingMessage />}
						<ChatErrorBoundary error={error} />
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
