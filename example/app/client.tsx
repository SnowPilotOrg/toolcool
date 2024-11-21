import { StartClient } from "@tanstack/start";
/// <reference types="vinxi/types/client" />
import { hydrateRoot } from "react-dom/client";
import { createRouter } from "./router"; // 1. import `NextUIProvider` component

const router = createRouter();

hydrateRoot(
	document,

	<StartClient router={router} />,
);
