import type { ToolProvider } from "../../index";
import { productHuntTools as generatedTools } from "./tools.generated";

export const productHuntProvider: ToolProvider = {
	name: "product_hunt",
	tools: generatedTools,
};
