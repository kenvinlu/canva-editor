import { MarkType } from 'prosemirror-model';
import { Command } from 'prosemirror-state';
import { unsetMark } from './unsetMark';
import { getMarkType } from '../helper/getMarkType';
import { isMarkActive } from '../helper/isMarkActive';
import { setMark } from './setMark';

export const toggleMark: (
    typeOrName: string | MarkType,
    attributes?: Record<string, string>,
    options?: {
        extendEmptyMarkRange?: boolean;
    },
) => Command =
    (typeOrName, attributes = {}, options = {}) =>
    (state, dispatch, ...rest) => {
        const type = getMarkType(typeOrName, state.schema);
        const isActive = isMarkActive(state, type);
        if (isActive) {
            return unsetMark(type, options)(state, dispatch, ...rest);
        }

        return setMark(type, attributes)(state, dispatch, ...rest);
    };
