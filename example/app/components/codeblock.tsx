import { Card, CardBody } from "@nextui-org/react";
import { CodeBlock } from "react-code-blocks";

export const CodeBlocker = ({
	code,
	language = "javascript",
}: { code: string; language?: string }) => {
	return (
		<Card className="w-full">
			<CardBody className="p-4">
				<CodeBlock
					text={code}
					language={language}
					showLineNumbers={false}
					wrapLongLines={true}
				/>
			</CardBody>
		</Card>
	);
};
