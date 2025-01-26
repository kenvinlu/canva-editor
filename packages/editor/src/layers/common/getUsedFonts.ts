import { SerializedPage, FontData } from 'canva-editor/types';
import { isEqual, uniqWith } from 'lodash';
import { TextContentProps } from '..';

export const getUsedFonts = (data: SerializedPage[]) => {
    const fontList: FontData[] = [];
    data.forEach((page) => {
        Object.entries(page.layers).forEach(([, layer]) => {
            if (layer.type.resolvedName === 'TextLayer') {
                fontList.push(...(layer.props as unknown as TextContentProps).fonts);
            }
        });
    });
    return uniqWith(fontList, isEqual);
};
