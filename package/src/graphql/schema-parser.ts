import { parse, type ObjectTypeDefinitionNode, Kind, TypeNode } from "graphql";

interface FieldArgument {
	name: string;
	type: string;
}

interface Field {
	name: string;
	type: string;
	args?: FieldArgument[];
}

interface TypeInfo {
	fields: Field[];
}

export interface SchemaTypes {
	[key: string]: TypeInfo;
}

export function parseSchema(schemaString: string): SchemaTypes {
	const ast = parse(schemaString);
	const types: SchemaTypes = {};

	for (const def of ast.definitions) {
		if (def.kind === Kind.OBJECT_TYPE_DEFINITION) {
			const node = def as ObjectTypeDefinitionNode;

			// Skip internal types
			if (
				node.name.value.endsWith("Connection") ||
				node.name.value.endsWith("Edge") ||
				node.name.value === "Query" ||
				node.name.value === "Mutation"
			) {
				continue;
			}

			types[node.name.value] = {
				fields: node.fields?.map((field) => ({
					name: field.name.value,
					type: getBaseType(field.type),
					args: field.arguments?.map((arg) => ({
						name: arg.name.value,
						type: getBaseType(arg.type),
					})),
				})) || [],
			};
		}
	}

	return types;
}

function getBaseType(type: TypeNode): string {
	if (type.kind === Kind.NON_NULL_TYPE || type.kind === Kind.LIST_TYPE) {
		return getBaseType(type.type);
	}
	return type.name.value;
}
