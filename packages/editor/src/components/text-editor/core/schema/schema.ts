import { Schema, NodeSpec, MarkSpec, DOMOutputSpec } from 'prosemirror-model';
import ParagraphSpec from './spec/paragraphSpec';
import ItalicSpec from './spec/italicSpec';
import BoldSpec from './spec/boldSpec';
import TextUnderlineSpec from './spec/underlineSpec';
import listItemSpec from './spec/listItemSpec';
import bulletListSpec from './spec/bulletListSpec';
import TextColorSpec from './spec/textColorSpec';

const brDOM: DOMOutputSpec = ['br'];

/// [Specs](#model.NodeSpec) for the nodes defined in this schema.
export const nodes = {
    /// NodeSpec The top level document node.
    doc: {
        content: 'block+',
    } as NodeSpec,

    /// A plain paragraph textblock. Represented in the DOM
    /// as a `<p>` element.
    paragraph: ParagraphSpec,
    listItem: listItemSpec,
    bulletList: bulletListSpec,

    /// The text node.
    text: {
        group: 'inline',
    } as NodeSpec,

    /// A hard line break, represented in the DOM as `<br>`.
    hard_break: {
        inline: true,
        group: 'inline',
        selectable: false,
        parseDOM: [{ tag: 'br' }],
        toDOM() {
            return brDOM;
        },
    } as NodeSpec,
};

export const marks = {
    link: {
        attrs: {
            href: {},
            title: { default: null },
        },
        inclusive: false,
        parseDOM: [
            {
                tag: 'a[href]',
                getAttrs(dom: HTMLElement) {
                    return { href: dom.getAttribute('href'), title: dom.getAttribute('title') };
                },
            },
        ],
        toDOM(node) {
            const { href, title } = node.attrs;
            return ['a', { href, title }, 0];
        },
    } as MarkSpec,

    italic: ItalicSpec,
    bold: BoldSpec,
    underline: TextUnderlineSpec,
    color: TextColorSpec,
};
export const schema = new Schema({ nodes, marks });
