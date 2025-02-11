import { EditorState } from 'prosemirror-state';
import { MarkType, Mark } from 'prosemirror-model';
import { getMarkType } from './getMarkType';
import { objectIncludes } from './object';

export function isMarkActive(
    state: EditorState,
    typeOrName: MarkType | string | null,
    attributes: Record<string, unknown> = {},
): boolean {
    const { empty, ranges } = state.selection;
    const type = typeOrName ? getMarkType(typeOrName, state.schema) : null;
    if (empty) {
        return !!(state.storedMarks || state.selection.$from.marks())
            .filter((mark) => {
                if (!type) {
                    return true;
                }
                return type.name === mark.type.name;
            })
            .find((mark) => objectIncludes(mark.attrs, attributes));
    }

    let selectionRange = 0;
    const markRanges: {
        mark: Mark;
        from: number;
        to: number;
    }[] = [];

    ranges.forEach(({ $from, $to }) => {
        const from = $from.pos;
        const to = $to.pos;

        state.doc.nodesBetween(from, to, (node, pos) => {
            if (!node.isText && !node.marks.length) {
                return;
            }

            const relativeFrom = Math.max(from, pos);
            const relativeTo = Math.min(to, pos + node.nodeSize);
            const range = relativeTo - relativeFrom;

            selectionRange += range;

            markRanges.push(
                ...node.marks.map((mark) => ({
                    mark,
                    from: relativeFrom,
                    to: relativeTo,
                })),
            );
        });
    });

    if (selectionRange === 0) {
        return false;
    }

    const matchedRange = markRanges
        .filter((markRange) => {
            if (!type) {
                return true;
            }

            return type.name === markRange.mark.type.name;
        })
        .filter((markRange) => objectIncludes(markRange.mark.attrs, attributes))
        .reduce((sum, markRange) => sum + markRange.to - markRange.from, 0);

    const excludedRange = markRanges
        .filter((markRange) => {
            if (!type) {
                return true;
            }

            return markRange.mark.type !== type && markRange.mark.type.excludes(type);
        })
        .reduce((sum, markRange) => sum + markRange.to - markRange.from, 0);

    const range = matchedRange > 0 ? matchedRange + excludedRange : matchedRange;

    return range >= selectionRange;
}
