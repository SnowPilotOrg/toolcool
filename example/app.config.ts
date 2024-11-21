// app.config.ts
import { defineConfig } from "@tanstack/start/config";
import viteTsConfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
	vite: {
		plugins: [
			TanStackRouterVite(),
			viteReact(),
			viteTsConfigPaths({
				projects: ["./tsconfig.json"],
			}),
		],
	},
	server: {
		// Nitro compatibility date
		compatibilityDate: "2024-11-20",
	},
});
