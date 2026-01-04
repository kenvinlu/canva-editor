import { Command, NodeSelection } from 'prosemirror-state';

export const selectNode: (position: number) => Command = (position) => {
    return (state, dispatch) => {
        const tr = state.tr;
        const { doc } = tr;
        const pos = Math.max(0, Math.min(doc.content.size, position));
        const selection = NodeSelection.create(doc, pos);

        tr.setSelection(selection);
        if (dispatch) {
            dispatch(tr);
            return true;
        }
        return false;
    };
};
