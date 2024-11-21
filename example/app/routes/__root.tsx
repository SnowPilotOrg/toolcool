import { NextUIProvider } from "@nextui-org/react";
import {
	Outlet,
	ScrollRestoration,
	createRootRoute,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import type { ReactNode } from "react";
import "~/main.css";

function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			<h1 className="text-4xl font-bold">404</h1>
			<p className="mt-4 text-xl">Page not found</p>
			<a href="/" className="mt-4 text-blue-500 hover:text-blue-600 underline">
				Go back home
			</a>
		</div>
	);
}

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
	}),
	component: RootComponent,
	pendingComponent: () => <div>Loading...</div>,
	errorComponent: () => <div>Error</div>,
	notFoundComponent: NotFound,
});

function RootComponent() {
	return (
		<RootDocument>
			<NextUIProvider>
				<Outlet />
			</NextUIProvider>
		</RootDocument>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en">
			<head>
				<Meta />
			</head>
			<body>
				<NextUIProvider>
					<Outlet />
				</NextUIProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}
