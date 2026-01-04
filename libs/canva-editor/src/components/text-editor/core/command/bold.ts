import { unsetMark } from './unsetMark';
import { toggleMark } from './toggleMark';
import { setMark } from './setMark';
import { Command } from 'prosemirror-state';

export const toggleBold: Command = (...params) => {
    return toggleMark('bold')(...params);
};
export const unsetBold: Command = (...params) => {
    return unsetMark('bold')(...params);
};
export const setBold: Command = (...params) => {
    return setMark('bold')(...params);
};

export const unsetBoldOfBlock: Command = (state, dispatch) => {
    const tr = state.tr.setSelection(state.selection);
    const { $from, $to } = tr.selection;
    const nodeRange = $from.blockRange($to);
    if (nodeRange && dispatch) {
        dispatch(state.tr.removeMark(nodeRange.start, nodeRange.end, state.schema.mark('bold')));
        return true;
    }
    return false;
};
