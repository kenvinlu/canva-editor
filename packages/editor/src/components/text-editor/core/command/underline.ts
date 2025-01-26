import { unsetMark } from './unsetMark';
import { toggleMark } from './toggleMark';
import { setMark } from './setMark';
import { Command } from 'prosemirror-state';

export const toggleUnderline: Command = (...params) => {
    return toggleMark('underline')(...params);
};
export const unsetUnderline: Command = (...params) => {
    return unsetMark('underline')(...params);
};
export const setUnderline: Command = (...params) => {
    return setMark('underline')(...params);
};
