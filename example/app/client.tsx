/// <reference types="vinxi/types/client" />
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/start";
import { createRouter } from "./router"; // 1. import `NextUIProvider` component

const router = createRouter();

hydrateRoot(
	document,

	<StartClient router={router} />,
);
