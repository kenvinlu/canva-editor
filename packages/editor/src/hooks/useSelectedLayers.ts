import { useEditor } from './useEditor';
import { useContext } from 'react';
import { PageContext } from '../layers/core/PageContext';

export const useSelectedLayers = () => {
    const { pageIndex } = useContext(PageContext);
    const { selectedLayerIds, selectedLayers } = useEditor((state) => {
        const pI = typeof pageIndex === 'undefined' ? state.activePage : pageIndex;
        const layerIds = (state.selectedLayers[pI] || []).filter((layerId) => {
            return state.pages[pI] && state.pages[pI].layers[layerId];
        });
        return {
            selectedLayerIds: layerIds,
            selectedLayers: layerIds.map((layerId) => state.pages[pI].layers[layerId]),
        };
    });

    return { selectedLayerIds, selectedLayers };
};
