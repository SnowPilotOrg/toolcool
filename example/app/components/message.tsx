import { CodeIcon } from "lucide-react";
import { LoadingDots } from "~/components/loading-dots";
import type { MessageType } from "~/lib/types";
import { BrandIcon } from "./brand-icon";

export const LoadingMessage = () => {
	return (
		<div className="flex justify-start">
			<div className="rounded-r-lg rounded-tl-lg bg-default-100 px-4 py-2">
				<LoadingDots />
			</div>
		</div>
	);
};

const MessageBubble = ({
	userRole,
	children,
}: {
	userRole: boolean;
	children: React.ReactNode;
}) => {
	return (
		<div className={`flex ${userRole ? "justify-end" : "justify-start"}`}>
			<div
				className={`px-4 py-2 ${
					userRole
						? "rounded-l-lg rounded-tr-lg bg-primary text-primary-foreground"
						: "rounded-r-lg rounded-tl-lg bg-default-100"
				} max-w-[80%] text-sm`}
			>
				{children}
			</div>
		</div>
	);
};

export const Message = ({ message, loading }: { message: MessageType; loading: boolean }) => {
	if (message.role === "tool") {
		return <></>;
	}

	if (message.tool_calls) {
		return (
			<>
				{message.tool_calls.map((tool_call, index) => (
					<MessageBubble
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={index}
						userRole={false}
					>
						<BrandIcon brand="hacker-news" className="mr-2 inline-block" />
						<span className={`${loading ? "animate-pulse" : ""}`}>
							{tool_call.function.name}
						</span>
					</MessageBubble>
				))}
			</>
		);
	}

	return (
		<MessageBubble userRole={message.role === "user"}>
			{message.content}
		</MessageBubble>
	);
};
