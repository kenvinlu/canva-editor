import { useContext, useMemo } from 'react';
import { LayerContext } from '../layers/core/LayerContext';
import { useEditor } from './useEditor';
import { PageContext } from '../layers/core/PageContext';
import { Layer, LayerActions, LayerComponentProps } from '../types';

export const useLayer = <P extends LayerComponentProps, C>(collector?: (layer: Layer<P>) => C) => {
    const { pageIndex } = useContext(PageContext);
    const { id } = useContext(LayerContext);
    const {
        state,
        actions: editorActions,
        ...collected
    } = useEditor((state) => {
        return (
            collector &&
            state.pages[pageIndex] &&
            state.pages[pageIndex].layers[id] &&
            collector(state.pages[pageIndex].layers[id] as unknown as Layer<P>)
        );
    });

    const actions = useMemo<LayerActions>(
        () => ({
            setProp: (props) => editorActions.setProp(pageIndex, id, props),
            select: () => editorActions.selectLayers(pageIndex, id),
            hover: (v) => editorActions.hoverLayer(pageIndex, typeof v === 'undefined' ? id : null),
            setTextEditor: (editor) => editorActions.setTextEditor(pageIndex, id, editor),
            openTextEditor: () => editorActions.openTextEditor(pageIndex, id),
            openImageEditor: ({ boxSize, position, rotate, image }) =>
                editorActions.openImageEditor(pageIndex, id, { boxSize, position, rotate, image }),
        }),
        [id, editorActions],
    );
    return {
        ...collected,
        pageIndex,
        id,
        state,
        actions,
    };
};
