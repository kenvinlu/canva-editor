import { useEffect, useRef } from 'react';
import { cloneDeep, throttle } from 'lodash';
import { useResize } from './useResize';
import { BoxData, LayerId, LayerDataRef, CursorPosition } from 'canva-editor/types';
import { Direction } from 'canva-editor/types/resize';
import { mergeWithoutArray, getPosition } from 'canva-editor/utils';
import { getVirtualDomHeight } from 'canva-editor/utils/dom/getVirtualDomHeight';
import { isImageLayer, isTextLayer } from 'canva-editor/utils/layer/layers';
import { useSelectedLayers, useEditor } from '.';
export type ResizeCallbackData = {
    controlBox: BoxData;
    layers: Record<LayerId, BoxData>;
    direction: Direction;
    lockAspect: boolean;
};

type ResizeRef = {
    clientX: number;
    clientY: number;
    lastClientX: number;
    lastClientY: number;
    isResizing: boolean;
    e?: MouseEvent | TouchEvent;
    direction: Direction;
    shiftKey: boolean;
};
export const useResizeLayer = ({
    options: { scalable },
    getLayerData,
    setLayerData,
    controlBox,
    getControlBoxData,
    setControlBoxData,
    onResize,
    onResizeStop,
}: {
    options: {
        scalable: boolean;
    };
    getLayerData: () => LayerDataRef;
    setLayerData: (data: LayerDataRef) => void;
    controlBox: BoxData | undefined;
    getControlBoxData: () => BoxData | undefined;
    setControlBoxData: (data: BoxData) => void;
    onResize: (data: ResizeCallbackData) => void;
    onResizeStop: (data: ResizeCallbackData) => void;
}) => {
    const resizeRef = useRef<ResizeRef>({
        clientX: 0,
        clientY: 0,
        lastClientX: 0,
        lastClientY: 0,
        direction: 'right',
        isResizing: false,
        shiftKey: false,
    });
    const { getResized } = useResize(getControlBoxData as () => BoxData);
    const { selectedLayers, selectedLayerIds } = useSelectedLayers();
    const { actions } = useEditor();

    const getNewSize = (clientX: number, clientY: number): BoxData => {
        const isImage = selectedLayers.length === 1 && isImageLayer(selectedLayers[0]);
        if (!scalable) {
            return getResized(
                resizeRef.current.direction,
                resizeRef.current,
                { clientX, clientY },
                (resizeRef.current.shiftKey && !isImage) ||
                    selectedLayerIds.length > 1 ||
                    ((isImage) &&
                        !resizeRef.current.shiftKey &&
                        !['top', 'left', 'right', 'bottom'].includes(resizeRef.current.direction)),
            );
        } else {
            const isScale = !['top', 'left', 'right', 'bottom'].includes(resizeRef.current.direction);
            const data = getResized(resizeRef.current.direction, resizeRef.current, { clientX, clientY }, isScale);
            const controlBox = getControlBoxData() as BoxData;
            return {
                ...data,
                scale: isScale
                    ? (data.boxSize.width / controlBox.boxSize.width) * (controlBox.scale || 1)
                    : controlBox.scale,
            };
        }
    };
    const calculateSize = ({ clientX, clientY }: CursorPosition) => {
        const startData = resizeRef.current as ResizeRef;
        const newData = getNewSize(clientX, clientY);
        if (
            !scalable ||
            !['top', 'left', 'right', 'bottom'].includes(startData.direction) ||
            selectedLayerIds.length > 1 ||
            !isTextLayer(selectedLayers[0])
        ) {
            return newData;
        } else {
            const { clientHeight } = getVirtualDomHeight(
                selectedLayers[0].data.editor?.dom as Element,
                newData.boxSize.width,
                newData.scale || 1,
            );
            return mergeWithoutArray(newData, {
                boxSize: { height: clientHeight },
            });
        }
    };

    const newLayerData = (change: BoxData) => {
        const layerData = getLayerData();
        const oldData = getControlBoxData() as BoxData;
        const ratio = change.boxSize.width / oldData.boxSize.width;
        const response: Record<LayerId, BoxData> = {};
        selectedLayers.forEach(({ id }) => {
            const layer = layerData[id];
            const newSize = { width: layer.boxSize.width * ratio, height: layer.boxSize.height * ratio };
            response[id] = {
                position: {
                    x:
                        oldData.position.x -
                        (oldData.position.x - layer.position.x) * ratio +
                        (change.position.x - oldData.position.x),
                    y:
                        oldData.position.y -
                        (oldData.position.y - layer.position.y) * ratio +
                        (change.position.y - oldData.position.y),
                },
                boxSize: newSize,
                scale: typeof layer.scale !== 'undefined' ? layer.scale * ratio : undefined,
                rotate: layer.rotate,
            };
        });
        return response;
    };

    const handleResize = throttle((e: TouchEvent | MouseEvent) => {
        if (!resizeRef.current.isResizing) {
            return;
        }
        const { clientX, clientY } = getPosition(e);
        resizeRef.current.lastClientX = clientX;
        resizeRef.current.lastClientY = clientY;
        resizeRef.current.e = e;
        const size = calculateSize({ clientX, clientY });
        actions.setResizeData(true, selectedLayerIds, resizeRef.current.direction, size.rotate, size.boxSize, {
            clientX,
            clientY,
        });
        if (selectedLayerIds.length === 1) {
            onResize({
                controlBox: size,
                layers: {
                    [selectedLayerIds[0]]: size,
                },
                direction: resizeRef.current.direction,
                lockAspect:
                    (!resizeRef.current.shiftKey &&
                        !['top', 'left', 'right', 'bottom'].includes(resizeRef.current.direction) &&
                        (isImageLayer(selectedLayers[0]))) ||
                    (resizeRef.current.shiftKey &&
                        (!isImageLayer(selectedLayers[0]))),
            });
        } else {
            onResize({
                controlBox: size,
                layers: newLayerData(size),
                direction: resizeRef.current.direction,
                lockAspect: true,
            });
        }
    }, 16);
    const handleResizeEnd = () => {
        if (!resizeRef.current.isResizing) {
            return;
        }
        const { lastClientX, lastClientY } = resizeRef.current;
        const size = calculateSize({ clientX: lastClientX, clientY: lastClientY });
        if (selectedLayerIds.length === 1) {
            onResizeStop({
                controlBox: size,
                layers: {
                    [selectedLayerIds[0]]: size,
                },
                direction: resizeRef.current.direction,
                lockAspect:
                    (!resizeRef.current.shiftKey &&
                        !['top', 'left', 'right', 'bottom'].includes(resizeRef.current.direction) &&
                        (isImageLayer(selectedLayers[0]))) ||
                    (resizeRef.current.shiftKey &&
                        (!isImageLayer(selectedLayers[0]))),
            });
        } else {
            onResizeStop({
                controlBox: size,
                layers: newLayerData(size),
                direction: resizeRef.current.direction,
                lockAspect: true,
            });
        }
        resizeRef.current.isResizing = false;
        unbindEvents();
    };
    const bindEvents = () => {
        actions.history.new();
        window.addEventListener('mousemove', handleResize);
        window.addEventListener('touchmove', handleResize);
        window.addEventListener('mouseup', handleResizeEnd, { once: true });
        window.addEventListener('mouseleave', handleResizeEnd, { once: true });
        window.addEventListener('touchend', handleResizeEnd, { once: true });
    };

    const unbindEvents = () => {
        actions.setResizeData(false);
        window.removeEventListener('mousemove', handleResize);
        window.removeEventListener('touchmove', handleResize);
    };
    useEffect(() => {
        const lockAspect = (e: KeyboardEvent) => {
            resizeRef.current.shiftKey = e.shiftKey;
            if (resizeRef.current.e && resizeRef.current.isResizing) {
                handleResize(resizeRef.current.e);
            }
        };
        window.addEventListener('keydown', lockAspect);
        window.addEventListener('keyup', lockAspect);
        return () => {
            window.removeEventListener('keydown', lockAspect);
            window.removeEventListener('keyup', lockAspect);
        };
    }, [getNewSize]);

    const startResizing = (e: MouseEvent | TouchEvent, direction: Direction) => {
        if (controlBox) {
            const { clientX, clientY } = getPosition(e);
            resizeRef.current = {
                clientX,
                clientY,
                lastClientX: clientX,
                lastClientY: clientY,
                direction,
                e,
                isResizing: true,
                shiftKey: false,
            };
            actions.setResizeData(
                true,
                selectedLayerIds,
                resizeRef.current.direction,
                controlBox.rotate,
                controlBox.boxSize,
                {
                    clientX,
                    clientY,
                },
            );
            setControlBoxData(controlBox);
            const layers: LayerDataRef = {};
            selectedLayers.forEach(
                ({
                    id,
                    data: {
                        props: { boxSize, position, rotate, scale },
                    },
                }) => {
                    layers[id] = cloneDeep({
                        boxSize,
                        position,
                        rotate,
                        scale,
                    });
                },
            );
            setLayerData(layers);
            bindEvents();
        }
    };
    return {
        startResizing,
    };
};
