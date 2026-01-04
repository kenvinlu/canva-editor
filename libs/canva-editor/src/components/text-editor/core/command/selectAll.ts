import { Command } from 'prosemirror-state';
import { selectText } from './selectText';

export const selectAll: Command = (state, dispatch, ...rest) => {
    selectText({ from: 0, to: state.doc.content.size })(state, dispatch, ...rest);
    return true;
};
