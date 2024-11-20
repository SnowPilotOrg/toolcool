// biome-ignore lint/correctness/noUnusedImports: <explanation>
import * as React from "react";
import * as fs from "node:fs";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { Button } from "@nextui-org/button";

const filePath = "count.txt";

async function readCount() {
	return Number.parseInt(
		await fs.promises.readFile(filePath, "utf-8").catch(() => "0"),
	);
}

const getCount = createServerFn({
	method: "GET",
}).handler(() => {
	return readCount();
});

const updateCount = createServerFn()
	.validator((d: number) => d)
	.handler(async ({ data }) => {
		const count = await readCount();
		await fs.promises.writeFile(filePath, `${count + data}`);
	});

export const Route = createFileRoute("/")({
	component: Home,
	loader: async () => await getCount(),
});

function Home() {
	const router = useRouter();
	const state = Route.useLoaderData();

	return (
		<Button
			type="button"
			onClick={() => {
				updateCount({ data: 1 }).then(() => {
					router.invalidate();
				});
			}}
		>
			Add 1 to {state}?
		</Button>
	);
}
