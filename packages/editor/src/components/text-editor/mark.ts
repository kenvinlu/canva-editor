import { Node } from 'prosemirror-model';
import { isArray, mergeWith, uniq } from 'lodash';
import { ColorParser } from '../../color-picker/utils';

export const getMarkAttrs = (node: Node) => {
    return node.marks.reduce((acc, mark) => {
        Object.entries(mark.attrs).forEach(([key, value]) => {
            if (!acc[key]) {
                acc[key] = [];
            }
            if (value) {
                acc[key].push(value);
            }
        });
        return acc;
    }, {} as Record<string, string[]>);
};
export const getAllMarks = (node: Node) => {
    let attrs: Record<string, string[]> = node.marks.reduce((acc, mark) => {
        Object.entries(mark.attrs).forEach(([key, value]) => {
            if (!acc[key]) {
                acc[key] = [];
            }
            if (value) {
                acc[key].push(value);
            }
        });
        return acc;
    }, {} as Record<string, string[]>);
    node.content.forEach((n) => {
        attrs = mergeWith(attrs, getAllMarks(n), (objValue, srcValue) => {
            if (isArray(objValue)) {
                return objValue.concat(srcValue);
            }
        });
    });
    return attrs;
};
export const getAttrs = (doc: Node) => {
    return Object.entries(doc.attrs).reduce((acc, [key, value]) => {
        if (value) {
            acc[key] = [value];
        }
        return acc;
    }, {} as Record<string, string[]>);
};
export const getAllAttrs = (doc: Node) => {
    const attrs: Record<string, string[]> = Object.entries(doc.attrs).reduce((acc, [key, value]) => {
        acc[key] = [value];
        return acc;
    }, {} as Record<string, string[]>);
    doc.content.forEach((node) => {
        Object.entries(node.attrs).forEach(([key, value]) => {
            if (!attrs[key]) {
                attrs[key] = [];
            }
            if (value) {
                attrs[key].push(value);
            }
        });
    });
    return attrs;
};

export const getFontFamily = (attrs: Record<string, string[]>) => {
    return uniq(attrs?.fontFamily || []);
};

export const getFontSize = (attrs: Record<string, string[]>) => {
    return uniq(attrs?.fontSize || []).map((f) => parseFloat(f));
};

export const getLineHeight = (attrs: Record<string, string[]>) => {
    return uniq(attrs?.lineHeight || []).map((f) => parseFloat(f));
};

export const getLetterSpacing = (attrs: Record<string, string[]>) => {
    return uniq(attrs?.letterSpacing || []).map((f) => parseFloat(f));
};

export const getColor = (attrs: Record<string, string[]>, markAttrs: Record<string, string[]>) => {
    const data = mergeWith(attrs, markAttrs, (objValue, srcValue) => {
        if (isArray(objValue)) {
            return objValue.concat(srcValue);
        }
    });
    return uniq(data?.color || []).map((c) => new ColorParser(c).toRgbString());
};
