/// <reference types="bun-types" />

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildClientSchema, printSchema } from "graphql";

async function fetchSchema() {
	const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`,
		},
		body: JSON.stringify({
			query: `
        query IntrospectionQuery {
          __schema {
            queryType {
              name
            }
            mutationType {
              name
            }
            subscriptionType {
              name
            }
            types {
              ...FullType
            }
            directives {
              name
              description
              locations
              args {
                ...InputValue
              }
            }
          }
        }

        fragment FullType on __Type {
          kind
          name
          description
          fields(includeDeprecated: true) {
            name
            description
            args {
              ...InputValue
            }
            type {
              ...TypeRef
            }
            isDeprecated
            deprecationReason
          }
          inputFields {
            ...InputValue
          }
          interfaces {
            ...TypeRef
          }
          enumValues(includeDeprecated: true) {
            name
            description
            isDeprecated
            deprecationReason
          }
          possibleTypes {
            ...TypeRef
          }
        }

        fragment InputValue on __InputValue {
          name
          description
          type {
            ...TypeRef
          }
          defaultValue
        }

        fragment TypeRef on __Type {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
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
          }
        }
      `,
		}),
	});

	const result = await response.json();

	if (result.errors) {
		throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
	}

	// Convert introspection query result to GraphQL SDL
	const schema = buildClientSchema(result.data);
	const sdl = printSchema(schema);

	writeFileSync(join(process.cwd(), "schema.graphql"), sdl);
}

fetchSchema().catch(console.error);
