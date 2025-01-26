import { getMarkType } from '../helper/getMarkType';
import { MarkType } from 'prosemirror-model';
import { Command } from 'prosemirror-state';
import { getMarkAttributes } from '../helper/getMarkAttributes';

export const setMark: (typeOrName: string | MarkType, attributes?: Record<string, string>) => Command =
    (typeOrName, attributes = {}) =>
    (state, dispatch) => {
        const tr = state.tr.setSelection(state.selection);
        const { selection } = tr;
        const { empty, ranges } = selection;
        const type = getMarkType(typeOrName, state.schema);

        if (empty) {
            const oldAttributes = getMarkAttributes(state, type);

            tr.addStoredMark(
                type.create({
                    ...oldAttributes,
                    ...attributes,
                }),
            );
        } else {
            ranges.forEach((range) => {
                const from = range.$from.pos;
                const to = range.$to.pos;

                state.doc.nodesBetween(from, to, (node, pos) => {
                    const trimmedFrom = Math.max(pos, from);
                    const trimmedTo = Math.min(pos + node.nodeSize, to);
                    const someHasMark = node.marks.find((mark) => mark.type === type);

                    // if there is already a mark of this type
                    // we know that we have to merge its attributes
                    // otherwise we add a fresh new mark
                    if (someHasMark) {
                        node.marks.forEach((mark) => {
                            if (type === mark.type) {
                                tr.addMark(
                                    trimmedFrom,
                                    trimmedTo,
                                    type.create({
                                        ...mark.attrs,
                                        ...attributes,
                                    }),
                                );
                            }
                        });
                    } else {
                        tr.addMark(trimmedFrom, trimmedTo, type.create(attributes));
                    }
                });
            });
        }
        if (dispatch) {
            dispatch(tr);
            return true;
        }
        return false;
    };
