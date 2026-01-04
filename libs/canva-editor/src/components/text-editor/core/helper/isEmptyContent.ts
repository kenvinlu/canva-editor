import { EditorState } from 'prosemirror-state';

export const isEmptyContent = (state: EditorState) => {
    const defaultContent = state.doc.type.createAndFill()?.toJSON();
    const content = state.doc.toJSON();
    return JSON.stringify(defaultContent) === JSON.stringify(content);
};
