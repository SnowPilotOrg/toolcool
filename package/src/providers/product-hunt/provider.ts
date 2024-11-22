import { readFileSync } from "node:fs";
import { generateToolsFromSchema } from "../../graphql/generate-tools";
import type { ToolProvider } from "../../index";

const schema = readFileSync("./schema.graphql", "utf-8");

const config = {
	endpoint: "https://api.producthunt.com/v2/api/graphql",
	getHeaders: () => ({
		Authorization: `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`,
	}),
};

const tools = generateToolsFromSchema(schema, config);

export const productHuntProvider: ToolProvider = {
	name: "product_hunt",
	tools,
};
