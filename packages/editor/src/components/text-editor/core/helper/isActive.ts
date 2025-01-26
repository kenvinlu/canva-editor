import { EditorState } from 'prosemirror-state';
import { isNodeActive } from './isNodeActive';
import { isMarkActive } from './isMarkActive';
import { getSchemaType } from './getSchemaType';

export function isActive(state: EditorState, name: string | null, attributes: Record<string, unknown> = {}): boolean {
    if (!name) {
        return isNodeActive(state, null, attributes) || isMarkActive(state, null, attributes);
    }

    const schemaType = getSchemaType(name, state.schema);

    if (schemaType === 'node') {
        return isNodeActive(state, name, attributes);
    }

    if (schemaType === 'mark') {
        return isMarkActive(state, name, attributes);
    }

    return false;
}
