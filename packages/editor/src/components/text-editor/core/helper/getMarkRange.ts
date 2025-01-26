import { Mark, MarkType, ResolvedPos } from 'prosemirror-model';
import { objectIncludes } from './object';

function findMarkInSet(marks: Mark[], type: MarkType, attributes: Record<string, unknown> = {}): Mark | undefined {
    return marks.find((item) => {
        return item.type === type && objectIncludes(item.attrs, attributes);
    });
}

function isMarkInSet(marks: Mark[], type: MarkType, attributes: Record<string, unknown> = {}): boolean {
    return !!findMarkInSet(marks, type, attributes);
}

export function getMarkRange(
    $pos: ResolvedPos,
    type: MarkType,
    attributes: Record<string, unknown> = {},
): {
    from: number;
    to: number;
} | void {
    if (!$pos || !type) {
        return;
    }

    let start = $pos.parent.childAfter($pos.parentOffset);

    if ($pos.parentOffset === start.offset && start.offset !== 0) {
        start = $pos.parent.childBefore($pos.parentOffset);
    }

    if (!start.node) {
        return;
    }

    const mark = findMarkInSet([...start.node.marks], type, attributes);

    if (!mark) {
        return;
    }

    let startIndex = start.index;
    let startPos = $pos.start() + start.offset;
    let endIndex = startIndex + 1;
    let endPos = startPos + start.node.nodeSize;

    findMarkInSet([...start.node.marks], type, attributes);

    while (startIndex > 0 && mark.isInSet($pos.parent.child(startIndex - 1).marks)) {
        startIndex -= 1;
        startPos -= $pos.parent.child(startIndex).nodeSize;
    }

    while (endIndex < $pos.parent.childCount && isMarkInSet([...$pos.parent.child(endIndex).marks], type, attributes)) {
        endPos += $pos.parent.child(endIndex).nodeSize;
        endIndex += 1;
    }

    return {
        from: startPos,
        to: endPos,
    };
}
