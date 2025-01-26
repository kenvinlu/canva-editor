import { serializeLayers } from './layers';
import { Page, SerializedPage } from '../../types';

export const serialize = (pages: Page[]): SerializedPage[] => {
    return pages.map((page) => {
        return {
            name: page.name,
            notes: page.notes,
            locked: page.locked,
            layers: serializeLayers(page.layers, 'ROOT'),
        };
    });
};
