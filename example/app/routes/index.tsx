
import { createFileRoute, useRouter } from "@tanstack/react-router";

import { Button } from "@nextui-org/button";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const router = useRouter();

	return (
		<Button
			type="button"
			onClick={() => {
				console.log("clicked");
			}}
		>
			Add Button
		</Button>
	);
}
