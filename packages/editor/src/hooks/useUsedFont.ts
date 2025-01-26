import { FontData } from 'canva-editor/types';
import { isTextLayer } from 'canva-editor/utils/layer/layers';
import { uniqBy } from 'lodash';
import { useEditor } from '.';

export const useUsedFont = () => {
    const { fontFamilyList } = useEditor((state) => {
        const fontFamilyList: FontData[] = [];
        state.pages.forEach((page) => {
            Object.entries(page.layers).forEach(([, layer]) => {
                if (isTextLayer(layer)) {
                    fontFamilyList.push(...layer.data.props.fonts);
                }
            });
        });
        return {
            fontFamilyList: uniqBy(fontFamilyList, 'name'),
        };
    });

    return { usedFonts: fontFamilyList };
};
