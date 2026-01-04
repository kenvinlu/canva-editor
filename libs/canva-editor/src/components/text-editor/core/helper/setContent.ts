import { Command } from 'prosemirror-state';
import { createDocument } from './createDocument';

export const setContent: (content: string) => Command = (content) => (state, dispatch) => {
    const tr = state.tr;
    const { doc } = tr;
    const document = createDocument(content, state.schema);
    if (dispatch) {
        tr.replaceWith(0, doc.content.size, document);
        dispatch(tr);
        return true;
    }
    return false;
};
