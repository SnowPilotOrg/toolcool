import { hackerNewsTools, productHuntTools } from "@snowpilot/toolcool";
import type { ToolCallType } from "~/lib/types";
import { BrandIcon } from "../brand-icon";
import { MessageBubble } from "./MessageBubble";

type ToolCallMessageProps = {
	toolCall: ToolCallType;
	loading: boolean;
};

export const ToolCallMessage = ({
	toolCall,
	loading,
}: ToolCallMessageProps) => {
	const getToolIcon = () => {
		if (hackerNewsTools.some((tool) => tool.name === toolCall.function.name)) {
			return <BrandIcon brand="hacker-news" className="mr-2 inline-block" />;
		}
		if (productHuntTools.some((tool) => tool.name === toolCall.function.name)) {
			return <BrandIcon brand="product-hunt" className="mr-2 inline-block" />;
		}
		return null;
	};

	return (
		<MessageBubble userRole={false}>
			{getToolIcon()}
			<span className={loading ? "animate-pulse" : ""}>
				{toolCall.function.name}
			</span>
		</MessageBubble>
	);
};
