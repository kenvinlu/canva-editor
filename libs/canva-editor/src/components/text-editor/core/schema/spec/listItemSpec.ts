import { NodeSpec } from 'prosemirror-model';

const ListItemSpec: NodeSpec = {
    content: 'paragraph block*',
    parseDOM: [{ tag: 'li' }],
    attrs: {
        align: { default: null },
        style: { default: 'display: list-item; ' },
    },

    toDOM(node) {
        return ['li', node.attrs, 0];
    },
    defining: true,
};

export default ListItemSpec;
