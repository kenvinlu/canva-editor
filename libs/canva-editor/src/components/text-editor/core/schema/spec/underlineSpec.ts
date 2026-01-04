import { MarkSpec } from 'prosemirror-model';

const TextUnderlineSpec: MarkSpec = {
    parseDOM: [
        { tag: 'u' },
        {
            style: 'text-decoration-line',
            getAttrs: (value) => {
                return value === 'underline' && null;
            },
        },
        {
            style: 'text-decoration',
            getAttrs: (value) => {
                return value === 'underline' && null;
            },
        },
    ],
    toDOM() {
        return ['u', 0];
    },
};

export default TextUnderlineSpec;
