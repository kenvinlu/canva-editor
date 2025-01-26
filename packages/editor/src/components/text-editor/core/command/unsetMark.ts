import { getMarkRange } from '../helper/getMarkRange';
import { MarkType } from 'prosemirror-model';
import { Command } from 'prosemirror-state';

export const unsetMark: (
    typeOrName: string | MarkType,
    options?: {
        extendEmptyMarkRange?: boolean;
    },
) => Command =
    (typeOrName, options = {}) =>
    (state, dispatch) => {
        const { extendEmptyMarkRange = false } = options;
        const tr = state.tr;
        const { selection } = tr;
        const mark = state.schema.mark(typeOrName);
        const { $from, empty, ranges } = selection;
        if (empty && extendEmptyMarkRange) {
            let { from, to } = selection;
            const attrs = $from.marks().find((m) => m.type === mark.type)?.attrs;
            const range = getMarkRange($from, mark.type, attrs);

            if (range) {
                from = range.from;
                to = range.to;
            }

            tr.removeMark(from, to, mark);
        } else {
            ranges.forEach((range) => {
                tr.removeMark(range.$from.pos, range.$to.pos, mark);
            });
        }

        tr.removeStoredMark(mark);
        if (dispatch) {
            dispatch(tr);
            return true;
        }
        return false;
    };
