import { HackerNewsProvider } from "./hacker-news";
import type { ToolProvider } from "../index";

export const builtInProviders: Record<string, () => ToolProvider> = {
	"hacker-news": () => new HackerNewsProvider(),
	// Add more built-in providers here
};

export function getProviders(names: string[]): Map<string, ToolProvider> {
	const providers = new Map<string, ToolProvider>();

	for (const name of names) {
		const providerFactory = builtInProviders[name];
		if (!providerFactory) {
			throw new Error(`Provider ${name} not found in built-in providers`);
		}
		providers.set(name, providerFactory());
	}

	return providers;
}
