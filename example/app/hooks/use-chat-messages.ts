import { useCallback, useState } from "react";
import type { ChatCompletionMessage } from "~/lib/types";

export function useChatMessages() {
	const [messages, setMessages] = useState<ChatCompletionMessage[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const addMessage = useCallback((message: ChatCompletionMessage) => {
		setMessages((prev) => [...prev, message]);
	}, []);

	const addMessages = useCallback((newMessages: ChatCompletionMessage[]) => {
		setMessages((prev) => [...prev, ...newMessages]);
	}, []);

	const removeLastMessage = useCallback(() => {
		setMessages((prev) => prev.slice(0, -1));
	}, []);

	const reset = useCallback(() => {
		setMessages([]);
		setError(null);
	}, []);

	return {
		messages,
		isLoading,
		error,
		setIsLoading,
		setError,
		addMessage,
		addMessages,
		removeLastMessage,
		reset,
	};
}
