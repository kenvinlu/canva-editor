import { Command, TextSelection } from 'prosemirror-state';

export const selectText: (position: { from: number; to: number }) => Command = (position) => {
    return (state, dispatch) => {
        const tr = state.tr;
        const { doc } = tr;
        const { from, to } = position;
        const minPos = TextSelection.atStart(doc).from;
        const maxPos = TextSelection.atEnd(doc).to;
        const resolvedFrom = Math.min(Math.max(from, minPos), maxPos);
        const resolvedEnd = Math.min(Math.max(to, minPos), maxPos);
        const selection = TextSelection.create(doc, resolvedFrom, resolvedEnd);

        tr.setSelection(selection);
        if (dispatch) {
            dispatch(tr);
            return true;
        }
        return false;
    };
};
