import { AllSelection, Command, NodeSelection, TextSelection } from 'prosemirror-state';
import { Attrs, NodeType, Node, ContentMatch } from 'prosemirror-model';
import { canSplit } from 'prosemirror-transform';

export const splitBlockKeepMarks: Command = (state, dispatch) => {
    return splitBlockAs((n) => {
        return { type: n.type.schema.nodes.paragraph, attrs: n.attrs };
    })(state, dispatch);
};

export function splitBlockAs(
    splitNode?: (node: Node, atEnd: boolean) => { type: NodeType; attrs?: Attrs } | null,
): Command {
    return (state, dispatch) => {
        const { $from, $to } = state.selection;
        if (state.selection instanceof NodeSelection && state.selection.node.isBlock) {
            if (!$from.parentOffset || !canSplit(state.doc, $from.pos)) return false;
            if (dispatch) dispatch(state.tr.split($from.pos).scrollIntoView());
            return true;
        }

        if (!$from.parent.isBlock) return false;

        const atEnd = $to.parentOffset == $to.parent.content.size;
        const tr = state.tr;
        if (state.selection instanceof TextSelection || state.selection instanceof AllSelection) tr.deleteSelection();
        const deflt = $from.depth == 0 ? null : defaultBlockAt($from.node(-1).contentMatchAt($from.indexAfter(-1)));
        const splitType = splitNode && splitNode($to.parent, atEnd);
        let types = splitType ? [splitType] : atEnd && deflt ? [{ type: deflt }] : undefined;
        let can = canSplit(tr.doc, tr.mapping.map($from.pos), 1, types);
        if (!types && !can && canSplit(tr.doc, tr.mapping.map($from.pos), 1, deflt ? [{ type: deflt }] : undefined)) {
            if (deflt) types = [{ type: deflt }];
            can = true;
        }
        if (can) {
            tr.split(tr.mapping.map($from.pos), 1, types);
            if (!atEnd && !$from.parentOffset && $from.parent.type != deflt) {
                const first = tr.mapping.map($from.before()),
                    $first = tr.doc.resolve(first);
                if (deflt && $from.node(-1).canReplaceWith($first.index(), $first.index() + 1, deflt))
                    tr.setNodeMarkup(tr.mapping.map($from.before()), deflt);
            }
        }
        const marks = state.storedMarks || (state.selection.$to.parentOffset && state.selection.$from.marks());
        if (marks) tr.ensureMarks(marks);
        dispatch && dispatch(tr);
        return true;
    };
}

function defaultBlockAt(match: ContentMatch) {
    for (let i = 0; i < match.edgeCount; i++) {
        const { type } = match.edge(i);
        if (type.isTextblock && !type.hasRequiredAttrs()) return type;
    }
    return null;
}
