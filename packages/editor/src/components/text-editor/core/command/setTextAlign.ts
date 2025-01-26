import { Node, NodeType } from 'prosemirror-model';
import { Command } from 'prosemirror-state';

export const setTextAlign: (alignment?: 'left' | 'center' | 'right' | 'justify') => Command = (alignment) => {
    return (state, dispatch) => {
        const tr = state.tr.setSelection(state.selection);
        const { selection, doc } = tr;
        if (!selection || !doc) {
            return false;
        }
        const { from, to } = selection;
        const tasks: { node: Node; pos: number; nodeType: NodeType }[] = [];

        const allowedNodeTypes = ['paragraph'];

        doc.nodesBetween(from, to, (node, pos) => {
            const nodeType = node.type;
            const align = node.attrs.align || null;
            if (align !== alignment && allowedNodeTypes.includes(nodeType.name)) {
                tasks.push({
                    node,
                    pos,
                    nodeType,
                });
            }
            return true;
        });

        if (!tasks.length) {
            return false;
        }
        tasks.forEach((job) => {
            const { node, pos, nodeType } = job;
            let { attrs } = node;
            if (alignment) {
                attrs = {
                    ...attrs,
                    textAlign: alignment,
                };
            } else {
                attrs = {
                    ...attrs,
                    textAlign: null,
                };
            }

            tr.setNodeMarkup(pos, nodeType, attrs, node.marks);
        });

        if (dispatch) {
            dispatch(tr);
            return true;
        }
        return false;
    };
};
