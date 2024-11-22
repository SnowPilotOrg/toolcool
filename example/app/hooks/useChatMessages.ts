import { useState, useCallback } from 'react';
import type { MessageType } from '~/lib/types';

export function useChatMessages() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback((message: MessageType) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const addMessages = useCallback((newMessages: MessageType[]) => {
    setMessages(prev => [...prev, ...newMessages]);
  }, []);

  const removeLastMessage = useCallback(() => {
    setMessages(prev => prev.slice(0, -1));
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
    reset
  };
} 