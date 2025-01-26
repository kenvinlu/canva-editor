import { setMark } from './setMark';
import { Command } from 'prosemirror-state';

export const setColor: (color: string) => Command = (color) => {
    return (state, dispatch, view) => {
        setMark('color', { color })(state, dispatch, view);
        return true;
    };
};
export const setColorForBlock: (color: string) => Command = (color) => {
    return (state, dispatch) => {
        const tr = state.tr.setSelection(state.selection);
        const { $from, $to } = tr.selection;
        const nodeRange = $from.blockRange($to);
        if (nodeRange && dispatch) {
            state.doc.nodesBetween(nodeRange.start, nodeRange.end, (node, pos) => {
                if (node.isBlock) {
                    const nodeType = node.type;
                    const attrs = {
                        ...node.attrs,
                        color,
                    };
                    tr.setNodeMarkup(pos, nodeType, attrs, node.marks);
                }
            });
            dispatch(tr);
            return true;
        }
        return false;
    };
};
