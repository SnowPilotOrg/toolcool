import type { MessageType } from "../lib/types";
import { LoadingDots } from "./loading-dots";

export const Message = ({ role, content, isLoading = false }: MessageType) => {
	return (
		<div
			className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
		>
			<div
				className={`px-4 py-2 ${
					role === "user"
						? "rounded-l-lg rounded-tr-lg bg-primary text-primary-foreground"
						: "rounded-r-lg rounded-tl-lg bg-default-100"
				} max-w-[80%] text-sm`}
			>
				{isLoading ? <LoadingDots /> : content}
			</div>
		</div>
	);
};
