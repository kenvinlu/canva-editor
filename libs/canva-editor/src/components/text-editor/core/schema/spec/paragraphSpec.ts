import { DOMOutputSpec, Node, NodeSpec } from 'prosemirror-model';
const ParagraphSpec: NodeSpec = {
    attrs: {
        textAlign: { default: null },
        color: { default: null },
        fontFamily: { default: null },
        fontSize: { default: null },
        lineHeight: { default: null },
        letterSpacing: { default: null },
        textTransform: { default: null },
        marginLeft: { default: null },
        indent: { default: null },
        listType: { default: '' },
    },
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p', getAttrs: (dom) => getAttrs(dom as HTMLElement) }],
    toDOM: (node) => toDOM(node),
};
const getAttrs = (dom: HTMLElement) => {
    const { lineHeight, letterSpacing, textTransform, textAlign, fontFamily, fontSize, color } = dom.style;
    const indentLevel = dom.getAttribute('data-indent');
    const indent = indentLevel ? parseInt(indentLevel, 10) : 0;
    const listType = indent ? (dom.getAttribute('data-list-type') === 'ordered' ? 'ordered' : '') : '';

    return {
        textAlign,
        textTransform,
        lineHeight,
        letterSpacing: parseInt(letterSpacing),
        fontFamily: fontFamily.replaceAll('"', ''),
        fontSize,
        color,
        indent,
        listType,
    };
};

const toDOM = (node: Node): DOMOutputSpec => {
    const { textAlign, textTransform, lineHeight, letterSpacing, fontFamily, fontSize, color, indent, listType } =
        node.attrs;
    const attrs: Record<string, string> = {};
    let style = '';
    if (textAlign && textAlign !== 'left') {
        style += `text-align: ${textAlign};`;
    }

    if (fontFamily) {
        style += `font-family: '${fontFamily}';`;
    }
    if (textTransform) {
        style += `text-transform: ${textTransform};`;
    }
    if (fontSize) {
        style += `font-size: ${fontSize};`;
    }
    if (color) {
        style += `color: ${color};`;
    }
    if (indent) {
        style += `--indent-level: ${indent};`;
        style += `display: list-item;`;
        attrs['data-indent'] = String(indent);
        attrs['data-list-type'] = listType;
        if (listType === 'ordered') {
            style += `list-style-type: none;`;
            const markerList = ['decimal', 'lower-alpha', 'lower-roman'];
            const marker = markerList[(indent - 1) % markerList.length];
            style += `--counter-list-marker: ${marker};`;
        } else {
            style += `list-style-type: disc;`;
        }
    }
    style += `line-height: ${lineHeight || 1.4};`;
    style += `letter-spacing: ${letterSpacing ? letterSpacing + 'em' : 'normal'};`;

    style && (attrs.style = style);
    return ['p', attrs, 0];
};

export default ParagraphSpec;
