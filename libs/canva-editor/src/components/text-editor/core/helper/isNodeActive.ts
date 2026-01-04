import { EditorState } from 'prosemirror-state';
import { NodeType, Node } from 'prosemirror-model';
import { getNodeType } from './getNodeType';
import { objectIncludes } from './object';

export const isNodeActive = (
    state: EditorState,
    typeOrName: NodeType | string | null,
    attributes: Record<string, unknown> = {},
) => {
    const { from, to, empty } = state.selection;
    const type = typeOrName ? getNodeType(typeOrName, state.schema) : null;

    const nodeRanges: {
        node: Node;
        from: number;
        to: number;
    }[] = [];
    state.doc.nodesBetween(from, to, (node, pos) => {
        if (node.isText) {
            return;
        }

        const relativeFrom = Math.max(from, pos);
        const relativeTo = Math.min(to, pos + node.nodeSize);

        nodeRanges.push({
            node,
            from: relativeFrom,
            to: relativeTo,
        });
    });

    const selectionRange = to - from;
    const matchedNodeRanges = nodeRanges
        .filter((nodeRange) => {
            if (!type) {
                return true;
            }

            return type.name === nodeRange.node.type.name;
        })
        .filter((nodeRange) => {
            return objectIncludes(nodeRange.node.attrs, attributes);
        });

    if (empty) {
        return !!matchedNodeRanges.length;
    }

    const range = matchedNodeRanges.reduce((sum, nodeRange) => sum + nodeRange.to - nodeRange.from, 0);

    return range >= selectionRange;
};
