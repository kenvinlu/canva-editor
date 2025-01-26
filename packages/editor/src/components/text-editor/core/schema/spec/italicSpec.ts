import { MarkSpec } from 'prosemirror-model';

const ItalicSpec: MarkSpec = {
    parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
    toDOM() {
        return ['em', 0];
    },
};

export default ItalicSpec;
