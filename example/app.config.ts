// app.config.ts
import { defineConfig } from "@tanstack/start/config";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	vite: {
		plugins: [
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
