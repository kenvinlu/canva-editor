import { MarkType, Schema } from 'prosemirror-model';

export function getMarkType(nameOrType: string | MarkType, schema: Schema): MarkType {
    if (typeof nameOrType === 'string') {
        if (!schema.marks[nameOrType]) {
            throw Error(`There is no mark type named '${nameOrType}'!`);
        }

        return schema.marks[nameOrType];
    }

    return nameOrType;
}
