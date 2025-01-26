import { RefObject, useCallback, useEffect, useState } from 'react';
import { useEditor } from './useEditor';
import { useLinkedRef } from './useLinkedRef';
import { getTransformStyle } from 'canva-editor/layers';
import { LayerId, BoxData, Delta } from 'canva-editor/types';
import { getPosition } from 'canva-editor/utils';
import { isIntersection } from 'canva-editor/utils/2d/isIntersection';
import { visualCorners } from 'canva-editor/utils/2d/visualCorners';

export const useSelectLayer = ({
    frameRef,
    pageListRef,
    selectionBoxRef,
}: {
    frameRef: RefObject<HTMLDivElement | null>;
    pageListRef: RefObject<HTMLDivElement[]>;
    selectionBoxRef: RefObject<HTMLDivElement | null>;
}) => {
    const [tmpSelected, setTmpSelected] = useState<
        { selectedPage: number; selectedLayers: Record<LayerId, BoxData> } | undefined
    >();

    const [selectionRef, getSelectionRef] = useLinkedRef<{
        clientX: number;
        clientY: number;
        moveClientX: number;
        moveClientY: number;
        isMultipleSelect: boolean;
    }>({
        clientX: 0,
        clientY: 0,
        moveClientX: 0,
        moveClientY: 0,
        isMultipleSelect: false,
    });
    const { actions, scale, isSelecting, pages } = useEditor((state) => {
        return {
            scale: state.scale,
            isSelecting: state.selectData.status,
            pages: state.pages,
        };
    });
    const pageRect = () => {
        return pages.map(({ layers }, pageIndex) => ({
            layers: [...layers.ROOT.data.child, 'ROOT'].reverse().reduce((acc, layerId) => {
                const {
                    id,
                    data: { props },
                } = layers[layerId];
                if (!(pageListRef.current as HTMLDivElement[])[pageIndex]) {
                    return acc;
                }
                const rect = (pageListRef.current as HTMLDivElement[])[pageIndex].getBoundingClientRect();
                const matrix = new WebKitCSSMatrix(getTransformStyle({ rotate: props.rotate }));
                const layerCorners = visualCorners(
                    {
                        width: props.boxSize.width * scale,
                        height: props.boxSize.height * scale,
                    },
                    matrix,
                    {
                        x: rect.x + (frameRef.current?.scrollLeft || 0) + props.position.x * scale,
                        y: rect.y + (frameRef.current?.scrollTop || 0) + props.position.y * scale,
                    },
                );
                acc.push({ id, delta: [layerCorners.nw, layerCorners.ne, layerCorners.se, layerCorners.sw] });
                return acc;
            }, [] as { id: LayerId; delta: Delta[] }[]),
        }));
    };

    const processSelect = useCallback(
        ({ clientX, clientY }: { clientX: number; clientY: number }, isClick = false) => {
            if (selectionBoxRef.current && frameRef.current) {
                const frameRect = frameRef.current.getBoundingClientRect();
                const scrollTop = frameRef.current.scrollTop || 0;
                const scrollLeft = frameRef.current.scrollLeft || 0;
                const selectionRef = getSelectionRef();
                const width = Math.abs(clientX + scrollLeft - selectionRef.clientX);
                const height = Math.abs(clientY + scrollTop - selectionRef.clientY);
                const left = clientX + scrollLeft > selectionRef.clientX ? selectionRef.clientX : clientX + scrollLeft;
                const top = clientY + scrollTop > selectionRef.clientY ? selectionRef.clientY : clientY + scrollTop;
                selectionBoxRef.current.style.left = `${left - frameRect.x}px`;
                selectionBoxRef.current.style.top = `${top - frameRect.y}px`;
                selectionBoxRef.current.style.width = `${width}px`;
                selectionBoxRef.current.style.height = `${height}px`;
                const selectionRect = [
                    { x: left, y: top },
                    { x: left + width, y: top },
                    { x: left + width, y: top + height },
                    { x: left, y: top + height },
                ];
                const selectedLayers: Record<LayerId, BoxData> = {};
                let selectedPage: number | null = null;
                pageRect().forEach(({ layers }, pageIndex) => {
                    const rect = (pageListRef.current as HTMLDivElement[])[pageIndex].getBoundingClientRect();
                    layers.forEach(({ id: layerId, delta: layerRect }) => {
                        if (
                            isIntersection(selectionRect, layerRect) &&
                            (selectedPage === null || selectedPage === pageIndex) &&
                            layerId !== 'ROOT' &&
                            ((isClick && selectedPage === null) || !isClick)
                        ) {
                            selectedPage = pageIndex;
                            selectedLayers[layerId] = {
                                boxSize: {
                                    width: pages[selectedPage].layers[layerId].data.props.boxSize.width * scale,
                                    height: pages[selectedPage].layers[layerId].data.props.boxSize.height * scale,
                                },
                                position: {
                                    x:
                                        rect.x -
                                        frameRect.x +
                                        (frameRef.current?.scrollLeft || 0) +
                                        pages[selectedPage].layers[layerId].data.props.position.x * scale,
                                    y:
                                        rect.y -
                                        frameRect.y +
                                        (frameRef.current?.scrollTop || 0) +
                                        pages[selectedPage].layers[layerId].data.props.position.y * scale,
                                },
                                rotate: pages[selectedPage].layers[layerId].data.props.rotate,
                            };
                        }
                    });
                    const rootLayer = layers.find((l) => l.id === 'ROOT');
                    if (
                        isClick &&
                        rootLayer &&
                        isIntersection(selectionRect, rootLayer.delta) &&
                        selectedPage === null
                    ) {
                        selectedPage = pageIndex;
                        selectedLayers['ROOT'] = {
                            boxSize: {
                                width: pages[selectedPage].layers.ROOT.data.props.boxSize.width * scale,
                                height: pages[selectedPage].layers.ROOT.data.props.boxSize.height * scale,
                            },
                            position: {
                                x: rect.x - frameRect.x + pages[selectedPage].layers.ROOT.data.props.position.x * scale,
                                y:
                                    rect.y -
                                    frameRect.y +
                                    (frameRef.current?.scrollTop || 0) +
                                    pages[selectedPage].layers.ROOT.data.props.position.y * scale,
                            },
                            rotate: pages[selectedPage].layers.ROOT.data.props.rotate,
                        };
                    }
                });
                if (selectedPage !== null) {
                    return {
                        selectedPage,
                        selectedLayers,
                    };
                }
            }
        },
        [pageRect, getSelectionRef],
    );
    const handleSelect = useCallback(
        (e: MouseEvent | TouchEvent) => {
            actions.setSelectData(true);
            const { clientX, clientY } = getPosition(e);
            selectionRef.current.moveClientX = clientX;
            selectionRef.current.moveClientY = clientY;

            const res = processSelect({ clientX, clientY });
            setTmpSelected(res);
        },
        [processSelect],
    );

    const handleSelectEnd = useCallback(
        (e: MouseEvent | TouchEvent) => {
            const { clientX, clientY } = getPosition(e);
            const res = processSelect(
                { clientX, clientY },
                clientX + (frameRef.current as HTMLDivElement).scrollLeft === getSelectionRef().clientX &&
                    clientY + (frameRef.current as HTMLDivElement).scrollTop === getSelectionRef().clientY,
            );
            if (res) {
                actions.selectLayers(
                    res.selectedPage,
                    Object.keys(res.selectedLayers),
                    getSelectionRef().isMultipleSelect ? 'add' : 'replace',
                );
            } else {
                actions.resetSelectLayer();
                actions.setSidebar();
            }
            unBindSelectLayerEvents();
            actions.setSelectData(false);
        },
        [processSelect],
    );
    const bindSelectLayerEvents = useCallback(() => {
        window.addEventListener('mousemove', handleSelect);
        window.addEventListener('mouseup', handleSelectEnd, { once: true });
    }, [handleSelect, handleSelectEnd]);

    const unBindSelectLayerEvents = useCallback(() => {
        window.removeEventListener('mousemove', handleSelect);
        window.removeEventListener('mouseup', handleSelectEnd);
    }, [handleSelect]);

    const handleSelectStart = (e: MouseEvent) => {
        const { clientX, clientY } = getPosition(e);
        setTmpSelected(undefined);
        actions.setSelectData(true);
        selectionRef.current.clientX = clientX + (frameRef.current as HTMLDivElement).scrollLeft;
        selectionRef.current.clientY = clientY + (frameRef.current as HTMLDivElement).scrollTop;
        bindSelectLayerEvents();
    };

    useEffect(() => {
        const handleScroll = () => {
            if (isSelecting) {
                const res = processSelect({
                    clientX: selectionRef.current.moveClientX || selectionRef.current.clientX,
                    clientY: selectionRef.current.moveClientY || selectionRef.current.clientY,
                });
                if (res) {
                    setTmpSelected(res);
                }
            }
        };
        frameRef.current?.addEventListener('scroll', handleScroll);
        return () => {
            frameRef.current?.removeEventListener('scroll', handleScroll);
        };
    }, [isSelecting]);
    return {
        tmpSelected,
        onSelectStart: handleSelectStart,
    };
};
