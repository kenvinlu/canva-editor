import { Node, NodeType } from 'prosemirror-model';
import { Command } from 'prosemirror-state';

export const setOrderedList: (indent: number) => Command = (indent) => {
    return (state, dispatch) => {
        const tr = state.tr.setSelection(state.selection);
        const { selection, doc } = tr;
        if (!selection || !doc) {
            return false;
        }
        const { from, to } = selection;
        const tasks: { node: Node; pos: number; nodeType: NodeType }[] = [];

        const allowedNodeTypes = new Set(['list_item', 'paragraph']);

        doc.nodesBetween(from, to, (node, pos) => {
            const nodeType = node.type;
            if (allowedNodeTypes.has(nodeType.name)) {
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
            attrs = {
                ...attrs,
                indent,
                listType: 'ordered',
            };

            tr.setNodeMarkup(pos, nodeType, attrs, node.marks);
        });

        if (dispatch) {
            dispatch(tr);
            return true;
        }
        return false;
    };
};
