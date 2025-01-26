import { NodeSpec } from 'prosemirror-model';

const BulletListSpec: NodeSpec = {
    content: 'listItem+',
    group: 'block',
    attrs: {
        align: { default: null },
        style: { default: 'list-style-type: disc;padding-left: 1.7em;margin:0;' },
    },

    parseDOM: [{ tag: 'ul' }],
    toDOM(node) {
        return ['ul', node.attrs, 0];
    },
};

export default BulletListSpec;
