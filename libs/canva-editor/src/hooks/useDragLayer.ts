import { cloneDeep, throttle } from 'lodash';
import { useEditor } from './useEditor';
import { isMobile } from 'react-device-detect';
import { RefObject, useEffect, useRef } from 'react';
import { useLinkedRef } from './useLinkedRef';
import { useTrackingShiftKey } from './useTrackingShiftKey';
import { getPosition } from 'canva-editor/utils';
import {
  BoxData,
  CursorPosition,
  Delta,
  HorizontalGuideline,
  Layer,
  LayerComponentProps,
  LayerDataRef,
  LayerId,
  VerticalGuideline,
} from 'canva-editor/types';
import { getTransformStyle } from 'canva-editor/layers';
import { boundingRect } from 'canva-editor/utils/2d/boundingRect';
import { isPointInsideBox } from 'canva-editor/utils/2d/isPointInsideBox';
import { rectangleInsideAnother } from 'canva-editor/utils/2d/rectangleInsideAnother';
import { visualCorners } from 'canva-editor/utils/2d/visualCorners';
import { getControlBoxSizeFromLayers } from 'canva-editor/utils/layer/getControlBoxSizeFromLayers';
import { useSelectedLayers } from '.';
import { isFrameLayer, isImageLayer } from 'canva-editor/utils/layer/layers';

export type DragCallbackData = {
  controlBox?: Delta;
  layers: Record<LayerId, Delta>;
};

export const useDragLayer = ({
  frameRef,
  pageListRef,
}: {
  frameRef: RefObject<HTMLDivElement>;
  pageListRef: RefObject<HTMLDivElement[]>;
}) => {
  const dragRef = useRef<{
    start: CursorPosition;
    last: CursorPosition;
    pageIndex: number;
    e: MouseEvent | TouchEvent;
  } | null>(null);
  //   const ref = useRef(null);
  const ref2 = useRef<any>(null);
  const shiftKeyRef = useTrackingShiftKey();
  const [, getLayerData, setLayerData] = useLinkedRef<LayerDataRef>({});
  const [, getControlBoxData, setControlBoxData] = useLinkedRef<BoxData>();
  const { selectedLayers, selectedLayerIds } = useSelectedLayers();
  const {
    actions,
    state,
    hoveredLayer,
    controlBox,
    scale,
    hoveredPage,
    activePage,
    pageSize,
    layers,
    isPageLocked,
    mainLayers,
  } = useEditor((state) => {
    const hoveredPage = parseInt(Object.keys(state.hoveredLayer)[0]);
    const hoverLayerId = state.hoveredLayer[hoveredPage];

    return {
      scale: state.scale,
      hoveredPage,
      isPageLocked:
        state.pages.length > 0
          ? state.pages[state.activePage]?.layers.ROOT.data.locked
          : false,
      controlBox: state.controlBox,
      hoveredLayer: hoverLayerId
        ? state.pages[hoveredPage].layers[hoverLayerId]
        : null,
      activePage: state.activePage,
      pageSize: state.pageSize,
      fontList: state.fontList,
      layers: state.pages[hoveredPage] && state.pages[hoveredPage].layers,
      mainLayers:
        state.pages[hoveredPage] &&
        state.pages[hoveredPage].layers.ROOT.data.child
          .map((c) => state.pages[hoveredPage].layers[c])
          .reverse(),
    };
  });
  let tempFrameLayer: Layer<LayerComponentProps> | null = null;

  const calculateSize = ({ clientX, clientY }: CursorPosition) => {
    const layersData = getLayerData();
    const dragData = dragRef.current?.start as CursorPosition;
    const changeX = (clientX - dragData.clientX) / scale;
    const changeY = (clientY - dragData.clientY) / scale;
    const callbackData: DragCallbackData = {
      layers: {},
    };
    Object.entries(layersData).forEach(([layerId, data]) => {
      callbackData.layers[layerId] = {
        x: data.position.x + changeX,
        y: data.position.y + changeY,
      };
    });
    const controlBoxData = getControlBoxData();
    if (controlBoxData) {
      callbackData.controlBox = {
        x: controlBoxData.position.x + changeX,
        y: controlBoxData.position.y + changeY,
      };
    }
    return callbackData;
  };
  const handleDragging = throttle((e: MouseEvent | TouchEvent) => {
    if (!dragRef.current) {
      return;
    }
    const { clientX, clientY } = getPosition(e);
    dragRef.current.last = {
      clientX: clientX + (frameRef.current as HTMLDivElement).scrollLeft,
      clientY: clientY + (frameRef.current as HTMLDivElement).scrollTop,
    };

    dragRef.current.e = e;
    const data = calculateSize(dragRef.current.last);
    const controlBox = getControlBoxData();
    const change =
      data.controlBox && controlBox && !shiftKeyRef.current
        ? getChange(
            { ...controlBox, position: data.controlBox },
            Object.keys(data.layers),
            layers,
            scale
          )
        : null;
    if (
      !shiftKeyRef.current &&
      (dragRef.current.last.clientX !== dragRef.current.start.clientX ||
        dragRef.current.last.clientY !== dragRef.current.start.clientY)
    ) {
      actions.setGuideline({
        horizontal: change?.line.horizontal || [],
        vertical: change?.line.vertical || [],
      });
    }

    actions.setDragData(true, Object.keys(data.layers));
    Object.entries(data.layers).forEach(([layerId, position]) => {
      if (dragRef.current) {
        actions.history.merge().setProp(dragRef.current.pageIndex, layerId, {
          position: {
            x: position.x + (change?.x || 0),
            y: position.y + (change?.y || 0),
          },
        });
      }
    });
    const layerIds = Object.keys(data.layers);
    const layer = state.pages[dragRef.current.pageIndex].layers[layerIds[0]];

    if (layerIds.length === 1 && isImageLayer(layer)) {
      const mainLayer = mainLayers.find((l) => {
        if (l.id === layer.id) return false;
        const maxtrix = new WebKitCSSMatrix(
            getTransformStyle({
              rotate: l.data.props.rotate,
            })
          ),
          rect = (pageListRef.current as HTMLDivElement[])[
            activePage
          ].getBoundingClientRect(),
          visualBox = visualCorners(
            {
              width: l.data.props.boxSize.width * scale,
              height: l.data.props.boxSize.height * scale,
            },
            maxtrix,
            {
              x: rect.x + l.data.props.position.x * scale,
              y: rect.y + l.data.props.position.y * scale,
            }
          );
        if (
          isPointInsideBox(
            {
              x: clientX,
              y: clientY,
            },
            visualBox
          )
        ) {
          return l;
        }
      });

      if (ref2.current && dragRef.current) {
        actions.history.merge().setProp(dragRef.current.pageIndex, layer.id, {
          transparency:
            ref2.current.imageLayer.data.props.image.transparency || 1,
        });

        actions.history
          .merge()
          .setProp(dragRef.current.pageIndex, ref2.current.affectedFrame.id, {
            image: ref2.current.affectedFrame.data.props.image
              ? {
                  url: ref2.current.affectedFrame.data.props.image.url,
                  boxSize: ref2.current.affectedFrame.data.props.image.boxSize,
                  position:
                    ref2.current.affectedFrame.data.props.image.position,
                  rotate: ref2.current.affectedFrame.data.props.image.rotate,
                }
              : null,
          });
        ref2.current = null;
      }

      if (mainLayer && isFrameLayer(mainLayer)) {
        const image = layer.data.props.image,
          layerRatio =
            mainLayer.data.props.boxSize.width /
            mainLayer.data.props.boxSize.height,
          imageRatio = image.boxSize.width / image.boxSize.height;
        ref2.current = {
          imageLayer: cloneDeep(layer),
          affectedFrame: cloneDeep(mainLayer),
        };
        actions.history.merge().setProp(dragRef.current.pageIndex, layer.id, {
          transparency: 0.5,
        });

        if (layerRatio > imageRatio) {
          actions.history
            .merge()
            .setProp(dragRef.current.pageIndex, mainLayer.id, {
              image: {
                url: image.url,
                thumb: image.thumb,
                boxSize: {
                  width:
                    mainLayer.data.props.boxSize.width /
                    mainLayer.data.props.scale,
                  height:
                    mainLayer.data.props.boxSize.width /
                    mainLayer.data.props.scale /
                    imageRatio,
                },
                rotate: 0,
                position: {
                  x: 0,
                  y:
                    -(
                      mainLayer.data.props.boxSize.width /
                        mainLayer.data.props.scale /
                        imageRatio -
                      mainLayer.data.props.boxSize.height /
                        mainLayer.data.props.scale
                    ) / 2,
                },
              },
            });
        } else {
          actions.history
            .merge()
            .setProp(dragRef.current.pageIndex, mainLayer.id, {
              image: {
                url: image.url,
                thumb: image.thumb,
                boxSize: {
                  width:
                    (mainLayer.data.props.boxSize.height /
                      mainLayer.data.props.scale) *
                    imageRatio,
                  height:
                    mainLayer.data.props.boxSize.height /
                    mainLayer.data.props.scale,
                },
                position: {
                  x:
                    -(
                      (mainLayer.data.props.boxSize.height /
                        mainLayer.data.props.scale) *
                        imageRatio -
                      mainLayer.data.props.boxSize.width /
                        mainLayer.data.props.scale
                    ) / 2,
                  y: 0,
                },
                rotate: 0,
              },
            });
        }
      }
    }

    if (data.controlBox && controlBox) {
      actions.setDragData(true, layerIds);
      actions.setControlBox({
        ...controlBox,
        position: {
          x: data.controlBox.x + (change?.x || 0),
          y: data.controlBox.y + (change?.y || 0),
        },
      });
    }
  }, 16);

  const handleDragEnd = () => {
    if (!dragRef.current) {
      return;
    }
    const { clientX, clientY } = dragRef.current.last as CursorPosition;

    actions.setGuideline({ vertical: [], horizontal: [] });
    if (
      clientX === dragRef.current.start.clientX &&
      clientY === dragRef.current.start.clientY
    ) {
      hoveredLayer &&
        actions.selectLayers(
          hoveredPage,
          hoveredLayer.id,
          shiftKeyRef.current ? 'add' : 'replace'
        );
      actions.history.back();
    } else {
      const controlBox = getControlBoxData();
      let isDelete = false;
      const data = calculateSize({ clientX, clientY });
      const change =
        data.controlBox && controlBox && !shiftKeyRef.current
          ? getChange(
              { ...controlBox, position: data.controlBox },
              Object.keys(data.layers),
              layers,
              scale
            )
          : null;

      if (data.controlBox && controlBox) {
        const boxSize = {
          ...controlBox,
          position: {
            x: data.controlBox.x + (change?.x || 0),
            y: data.controlBox.y + (change?.y || 0),
          },
        };
        const rect = boundingRect(
          boxSize.boxSize,
          boxSize.position,
          boxSize.rotate
        );
        if (
          rect.x >= pageSize.width ||
          rect.y >= pageSize.height ||
          rect.x + rect.width < 0 ||
          rect.y + rect.height < 0 ||
          tempFrameLayer
        ) {
          actions.deleteLayer(
            dragRef.current?.pageIndex,
            Object.keys(data.layers)
          );
          isDelete = true;
        }
      }
      !isDelete &&
        Object.entries(data.layers).forEach(([layerId, position]) => {
          dragRef.current &&
            actions.history
              .merge()
              .setProp(dragRef.current.pageIndex, layerId, {
                transparency: 1,
                position: {
                  x: position.x + (change?.x || 0),
                  y: position.y + (change?.y || 0),
                },
              });
        });

      if (ref2.current) {
        actions.history
          .merge()
          .deleteLayer(dragRef.current.pageIndex, ref2.current.imageLayer.id);
        ref2.current = null;
      }

      if (data.controlBox && controlBox && !isDelete) {
        actions.setControlBox({
          ...controlBox,
          position: {
            x: data.controlBox.x + (change?.x || 0),
            y: data.controlBox.y + (change?.y || 0),
          },
        });
      }
    }
    dragRef.current = null;
    setLayerData({});
    actions.setDragData(false);
    window.removeEventListener('mousemove', handleDragging);
    window.removeEventListener('mouseup', handleDragEnd);
    window.removeEventListener('mouseleave', handleDragEnd);
    window.removeEventListener('touchmove', handleDragging);
    window.removeEventListener('touchend', handleDragEnd);
  };
  const bindDraggingEvents = () => {
    actions.history.new();
    window.addEventListener('touchmove', handleDragging);
    window.addEventListener('mousemove', handleDragging);
    window.addEventListener('mouseup', handleDragEnd, { once: true });
    window.addEventListener('mouseleave', handleDragEnd, { once: true });
    window.addEventListener('touchend', handleDragEnd, { once: true });
  };
  useEffect(() => {
    const handleScroll = () => {
      dragRef.current && handleDragging(dragRef.current.e);
    };
    frameRef.current?.addEventListener('scroll', handleScroll);
    return () => {
      frameRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [frameRef, handleDragging]);
  const handleDragStart = (e: TouchEvent | MouseEvent) => {
    const { clientX, clientY } = getPosition(e);
    dragRef.current = {
      start: {
        clientX: clientX + (frameRef.current as HTMLDivElement).scrollLeft,
        clientY: clientY + (frameRef.current as HTMLDivElement).scrollTop,
      },
      last: {
        clientX: clientX + (frameRef.current as HTMLDivElement).scrollLeft,
        clientY: clientY + (frameRef.current as HTMLDivElement).scrollTop,
      },
      pageIndex: activePage,
      e,
    };
    const data: LayerDataRef = {};
    let isInsideControlBox = false;
    let isInsertion = false;
    let isContainLockedLayer = false;

    if (controlBox) {
      const matrix = new WebKitCSSMatrix(
        getTransformStyle({
          rotate: controlBox.rotate,
        })
      );
      const rect = (pageListRef.current as HTMLDivElement[])[
        activePage
      ].getBoundingClientRect();
      const controlBoxCorner = visualCorners(
        {
          width: controlBox.boxSize.width * scale,
          height: controlBox.boxSize.height * scale,
        },
        matrix,
        {
          x: rect.x + controlBox.position.x * scale,
          y: rect.y + controlBox.position.y * scale,
        }
      );
      isInsideControlBox = isPointInsideBox(
        { x: clientX, y: clientY },
        controlBoxCorner
      );
      if (
        isInsideControlBox &&
        hoveredLayer &&
        !selectedLayerIds.includes(hoveredLayer.id)
      ) {
        isInsertion = rectangleInsideAnother(
          hoveredLayer.data.props,
          controlBox
        );
      }
    }
    if (shiftKeyRef.current || (isInsideControlBox && !isInsertion)) {
      selectedLayers.forEach(
        ({
          id,
          data: {
            props: { position, boxSize, rotate, scale },
            locked,
          },
        }) => {
          if (!locked) {
            isContainLockedLayer = locked;
          }
          data[id] = cloneDeep({ position, boxSize, rotate, scale });
        }
      );
    }
    if (
      hoveredLayer &&
      (!isInsideControlBox || (isInsideControlBox && isInsertion))
    ) {
      const { position, boxSize, rotate, scale } = hoveredLayer.data.props;
      data[hoveredLayer.id] = cloneDeep({ position, boxSize, rotate, scale });
      if (!isContainLockedLayer) {
        isContainLockedLayer = hoveredLayer.data.locked;
      }
      if (dragRef.current) {
        dragRef.current.pageIndex = hoveredPage;
      }
      const ctrlBox = getControlBoxSizeFromLayers(data);
      ctrlBox && setControlBoxData(ctrlBox);
    } else if (controlBox) {
      isContainLockedLayer = !!selectedLayers.find(
        ({ data: { locked } }) => locked
      );
      setControlBoxData(controlBox);
    }
    setLayerData(data);
    if (!isContainLockedLayer && !isPageLocked) {
      isMobile && actions.setDragData(true, Object.keys(data)); // To avoid swipe when dragging
      bindDraggingEvents();
    } else {
      dragRef.current = null;
    }
  };

  return {
    onDragStart: handleDragStart,
  };
};

type Rect = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  centerX: number;
  centerY: number;
};

const getChange = (
  controlBox: BoxData,
  selectedLayerIds: LayerId[],
  layers: Record<LayerId, Layer<LayerComponentProps>>,
  frameScale: number
) => {
  const change: {
    x: number | null;
    y: number | null;
    line: {
      horizontal: HorizontalGuideline[];
      vertical: VerticalGuideline[];
    };
    frameLayer: Layer<LayerComponentProps> | null;
  } = {
    x: null,
    y: null,
    line: {
      horizontal: [],
      vertical: [],
    },
    frameLayer: null,
  };
  if (controlBox && controlBox) {
    const boxRect = boundingRect(
      controlBox.boxSize,
      controlBox.position,
      controlBox.rotate
    );
    const active: Rect = {
      top: boxRect.y,
      left: boxRect.x,
      right: boxRect.x + boxRect.width,
      bottom: boxRect.y + boxRect.height,
      centerX: boxRect.centerX,
      centerY: boxRect.centerY,
    };
    Object.entries(layers).forEach(([layerId, layer]) => {
      if (selectedLayerIds.includes(layerId) || layer.data.parent !== 'ROOT') {
        return;
      }
      const layerRect = boundingRect(
        layer.data.props.boxSize,
        layer.data.props.position,
        layer.data.props.rotate
      );
      const target: Rect = {
        top: layerRect.y,
        left: layerRect.x,
        right: layerRect.x + layerRect.width,
        bottom: layerRect.y + layerRect.height,
        centerX: layerRect.centerX,
        centerY: layerRect.centerY,
      };
      const horizontalKey: (keyof Rect)[] = ['top', 'bottom', 'centerY'];
      const verticalKey: (keyof Rect)[] = ['left', 'right', 'centerX'];
      Object.keys(active).forEach((activePoint) => {
        if (horizontalKey.includes(activePoint as keyof Rect)) {
          horizontalKey.forEach((targetPoint) => {
            if (
              isInRange(
                active[activePoint as keyof Rect],
                target[targetPoint],
                frameScale
              )
            ) {
              if (
                change.y === null ||
                change.y <
                  target[targetPoint] - active[activePoint as keyof Rect]
              ) {
                change.y =
                  target[targetPoint] - active[activePoint as keyof Rect];
              }
              if (
                active[activePoint as keyof Rect] + change.y ===
                target[targetPoint]
              ) {
                change.line.horizontal.push({
                  y: target[targetPoint],
                  x1: Math.min(active.left, target.left),
                  x2: Math.max(active.right, target.right),
                });
              }
            }
          });
        }
        if (verticalKey.includes(activePoint as keyof Rect)) {
          verticalKey.forEach((targetPoint) => {
            if (
              isInRange(
                active[activePoint as keyof Rect],
                target[targetPoint],
                frameScale
              )
            ) {
              if (
                change.x === null ||
                change.x <
                  target[targetPoint] - active[activePoint as keyof Rect]
              ) {
                change.x =
                  target[targetPoint] - active[activePoint as keyof Rect];
              }
              if (
                active[activePoint as keyof Rect] + change.x ===
                target[targetPoint]
              ) {
                change.line.vertical.push({
                  x: target[targetPoint],
                  y1: Math.min(active.top, target.top),
                  y2: Math.max(active.bottom, target.bottom),
                });
              }
            }
          });
        }
      });
    });
  }
  return change;
};

const ALIGN_MARGIN = 4;
const isInRange = (value1: number, value2: number, frameScale: number) => {
  return (
    Math.abs(Math.round(value1) - Math.round(value2)) <=
    ALIGN_MARGIN / frameScale
  );
};
