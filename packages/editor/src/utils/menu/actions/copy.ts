import { EditorState } from 'canva-editor/types/editor';
import { serializeLayers } from '../../layer/layers';
import { LayerId, SerializedLayerTree } from 'canva-editor/types';

export const copy = async (state: EditorState, { pageIndex, layerIds }: { pageIndex: number; layerIds: LayerId[] }) => {
    if (typeof window === 'undefined') return;
    const data: SerializedLayerTree[] = [];
    layerIds.map((layerId) => {
        data.push({
            rootId: layerId,
            layers: serializeLayers(state.pages[pageIndex].layers, layerId),
        });
    });
    await navigator.clipboard.writeText(JSON.stringify(data));
};
