/// <reference types="bun-types" />

import { buildClientSchema, printSchema } from "graphql";

const fetchSchema = async () => {
	if (!process.env.PRODUCT_HUNT_API_TOKEN) {
		throw new Error("PRODUCT_HUNT_API_TOKEN is required");
	}

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
            queryType { name }
            mutationType { name }
            subscriptionType { name }
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
          type { ...TypeRef }
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
		throw new Error(
			`GraphQL Errors: ${JSON.stringify(result.errors, null, 2)}`,
		);
	}

	if (!result.data) {
		console.log("Full response:", JSON.stringify(result, null, 2));
		throw new Error("No data received from introspection query");
	}

	try {
		const schema = buildClientSchema(result.data);
		const sdl = printSchema(schema);
		await Bun.write("schema.graphql", sdl);
		console.log("✓ Schema fetched and saved to schema.graphql");
	} catch (error) {
		console.error("Error processing schema:", error);
		console.log("Received data:", JSON.stringify(result.data, null, 2));
		throw error;
	}
};

fetchSchema().catch(console.error);
