import { Card } from "@nextui-org/card";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

interface CodeBlockProps {
	code: string;
	language?: string;
}

export function CodeBlock({ code, language = "typescript" }: CodeBlockProps) {
	return (
		<Card className="w-full">
			<SyntaxHighlighter
				language={language}
				showLineNumbers
				customStyle={{
					margin: 0,
					borderRadius: 0,
					fontSize: "0.875rem",
					fontFamily: "monospace",
					lineHeight: "1.5",
					backgroundColor: "white",
				}}
			>
				{code}
			</SyntaxHighlighter>
		</Card>
	);
}
