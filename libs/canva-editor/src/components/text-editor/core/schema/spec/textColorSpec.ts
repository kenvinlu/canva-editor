import { Mark, MarkSpec } from 'prosemirror-model';

const TextColorSpec: MarkSpec = {
    attrs: {
        color: { default: '' },
    },
    inline: true,
    group: 'inline',
    parseDOM: [
        {
            style: 'color',
            getAttrs: (color) => {
                return {
                    color,
                };
            },
        },
    ],
    toDOM(mark: Mark) {
        const { color } = mark.attrs;
        let style = '';
        if (color) {
            style += `color: ${color};`;
        }
        return ['span', { style }, 0];
    },
};

export default TextColorSpec;
