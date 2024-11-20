import { cn } from "@nextui-org/react";
import type { ReactNode } from "react";

export const Background = ({
	children,
	className,
}: Readonly<{ children: ReactNode; className?: string }>) => {
	return (
		<div className={`relative h-screen w-screen bg-white ${className}`}>
			<div
				className={cn(
					"absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] ",
					className,
				)}
			>
				{children}
			</div>
		</div>
	);
};
