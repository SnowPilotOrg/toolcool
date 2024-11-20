import { Card, CardBody } from "@nextui-org/react";
import { CopyBlock } from "react-code-blocks";

export const CodeBlock = ({
	code,
	language = "javascript",
}: { code: string; language?: string }) => {
	return (
		<Card className="w-full">
			<CardBody className="p-4">
				<CopyBlock
					text={code}
					language={language}
					showLineNumbers={true}
					wrapLongLines={true}
				/>
			</CardBody>
		</Card>
	);
};
