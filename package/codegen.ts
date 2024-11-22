import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	schema: "./schema.graphql",
	generates: {
		"./src/generated/types.ts": {
			plugins: ["typescript"],
		},
		"./src/generated/validators.ts": {
			plugins: ["typescript-validation-schema"],
			config: {
				schema: "zod",
				importFrom: "./types",
				scalarSchemas: {
					DateTime: "z.string().datetime()",
					URL: "z.string().url()",
				},
				validationSchemaExportType: "const",
				notAllowedTypes: [
					"__Schema",
					"__Type",
					"__TypeKind",
					"__Field",
					"__InputValue",
					"__EnumValue",
					"__Directive",
					"__DirectiveLocation",
				],
			},
		},
	},
};

export default config;
