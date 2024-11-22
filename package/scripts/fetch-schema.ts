/// <reference types="bun-types" />

import { writeFileSync } from "node:fs";
import { join } from "node:path";

async function fetchSchema() {
	const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`,
		},
		body: JSON.stringify({
			query: `
        query IntrospectionQuery {
          __schema {
            types {
              kind
              name
              description
              fields {
                name
                description
                args {
                  name
                  description
                  type {
                    kind
                    name
                    ofType {
                      kind
                      name
                    }
                  }
                }
                type {
                  kind
                  name
                  ofType {
                    kind
                    name
                  }
                }
              }
            }
          }
        }
      `,
		}),
	});

	const result = await response.json();
	
	if (result.errors) {
		throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
	}

	writeFileSync(
		join(process.cwd(), "schema.graphql"), 
		JSON.stringify(result.data.__schema, null, 2)
	);
}

fetchSchema().catch(console.error);
