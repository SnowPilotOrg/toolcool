import type { MessageType } from "../lib/types";
import { LoadingDots } from "./loading-dots";

export const Message = ({ role, content, isLoading }: MessageType) => {
	return (
		<div
			className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
		>
			<div
				className={`px-4 py-2 rounded-lg max-w-[80%] ${
					role === "user"
						? "bg-primary text-primary-foreground"
						: "bg-default-100"
				}`}
			>
				{isLoading ? <LoadingDots /> : content}
			</div>
		</div>
	);
};
