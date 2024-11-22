import { hackerNewsTools, productHuntTools } from "@snowpilot/toolcool";

export const config = {
  models: {
    chat: "gpt-4o-mini" as const,
  },
  tools: {
    hackerNews: hackerNewsTools,
    productHunt: productHuntTools,
    all: [...hackerNewsTools, ...productHuntTools],
  },
  ui: {
    maxMessagePreviewLength: 20,
    scrollBehavior: "smooth" as const,
    errorDisplayDuration: 5000,
  },
} as const; 