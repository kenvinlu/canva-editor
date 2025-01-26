import React, { createElement, FC, Fragment, ReactElement, useMemo } from 'react';
import LayerElement from './LayerElement';
import TransformLayer from './TransformLayer';
import { useLayer, useEditor } from '../../hooks';

const RenderLayer: FC = () => {
    const { id, comp, props, layers, type, actions, parent } = useLayer((layer) => ({
        id: layer.id,
        comp: layer.data.comp,
        props: layer.data.props,
        layers: layer.data.child,
        type: layer.data.type,
        parent: layer.data.parent,
    }));
    const { isResize, pageSize, isDragging, isRotate } = useEditor((state) => ({
        isResize: state.resizeData.status,
        isDragging: state.dragData.status,
        isRotate: state.rotateData.status,
        pageSize: state.pageSize,
    }));
    const handleHover = (e: React.MouseEvent) => {
        if (isResize || !['ROOT', null].includes(parent) || isDragging || isRotate) return;
        e.stopPropagation();
        actions.hover();
    };
    const handleMouseOut = () => {
        actions.hover(null);
    };

    return useMemo(() => {
        if (!comp) {
            return null;
        }
        let child: ReactElement | null = null;
        if (layers && layers.length > 0) {
            child = (
                <Fragment>
                    {layers.map((id) => (
                        <LayerElement key={id} id={id} />
                    ))}
                </Fragment>
            );
        }
        if (id === 'ROOT') {
            const render = createElement(comp, props, child);
            return (
                <div onMouseOver={handleHover} onMouseLeave={handleMouseOut} onMouseOut={handleMouseOut}>
                    {render}
                </div>
            );
        }
        const render = createElement(comp, props, child);
        return (
            <TransformLayer
                boxSize={props.boxSize}
                rotate={props.rotate}
                position={props.position}
                transparency={props.transparency}
            >
                <div onMouseOver={handleHover} onMouseLeave={handleMouseOut} onMouseOut={handleMouseOut}>
                    {render}
                </div>
            </TransformLayer>
        );
    }, [type, comp, props, layers, isResize, pageSize, isRotate, isDragging]);
};

export default React.memo(RenderLayer);
