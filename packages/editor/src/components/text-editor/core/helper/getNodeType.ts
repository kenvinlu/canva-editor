import { NodeType, Schema } from 'prosemirror-model';

export function getNodeType(nameOrType: string | NodeType, schema: Schema): NodeType {
    if (typeof nameOrType === 'string') {
        if (!schema.nodes[nameOrType]) {
            throw Error(`There is no node type named '${nameOrType}'!`);
        }

        return schema.nodes[nameOrType];
    }

    return nameOrType;
}
