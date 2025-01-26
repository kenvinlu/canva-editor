import { BoxData, LayerId, LayerDataRef, Delta, CursorPosition } from 'canva-editor/types';
import { getPosition } from 'canva-editor/utils';
import { boundingRect } from 'canva-editor/utils/2d/boundingRect';
import { cloneDeep, throttle } from 'lodash';
import { useRef } from 'react';
import { useSelectedLayers, useEditor } from '.';

export type RotateCallbackData = { controlBox?: BoxData; layers: Record<LayerId, BoxData> };
const setRightAngle = (rotate: number) => {
    if ((rotate < 1 && rotate >= 0) || (rotate <= 360 && rotate > 359)) {
        return 0;
    } else if (rotate > 44 && rotate < 46) {
        return 45;
    } else if (rotate > 89 && rotate < 91) {
        return 90;
    } else if (rotate > 134 && rotate < 136) {
        return 135;
    } else if (rotate > 179 && rotate < 181) {
        return 180;
    } else if (rotate > 224 && rotate < 226) {
        return 225;
    } else if (rotate > 269 && rotate < 271) {
        return 270;
    } else {
        return rotate;
    }
};
export const useRotateLayer = ({
    pageIndex,
    getLayerData,
    setLayerData,
    pageOffset,
    getControlBoxData,
    setControlBoxData,
    onRotate,
}: {
    pageIndex: number;
    getLayerData: () => LayerDataRef;
    setLayerData: (data: LayerDataRef) => void;
    pageOffset: Delta;
    getControlBoxData: () => BoxData | undefined;
    setControlBoxData: (data: BoxData) => void;
    onRotate: (data: RotateCallbackData) => void;
    onRotateEnd: (data: RotateCallbackData) => void;
}) => {
    const rotateRef = useRef<{ centerX: number; centerY: number; last: CursorPosition; prevDegree: number }>();
    const { selectedLayers, selectedLayerIds } = useSelectedLayers();
    const { scale, controlBox, actions } = useEditor((state, query) => {
        const hoverLayerId = state.hoveredLayer[pageIndex];
        return {
            scale: state.scale,
            controlBox: state.controlBox as BoxData,
            hoveredLayer: hoverLayerId && query.getLayer(pageIndex, hoverLayerId),
        };
    });

    const newLayerData = (degree: number) => {
        const degreeChange = degree - (getControlBoxData() as BoxData).rotate;
        const cos = Math.cos((degreeChange * Math.PI) / 180);
        const sin = Math.sin((degreeChange * Math.PI) / 180);
        const layerData = getLayerData();
        const res: Record<LayerId, BoxData> = {};
        const centerGroupX = rotateRef.current?.centerX || 0;
        const centerGroupY = rotateRef.current?.centerY || 0;
        selectedLayerIds.map((layerId) => {
            const layer = layerData[layerId];
            const { centerX, centerY } = { centerX: 0, centerY: 0, ...layer };
            const centerGroup = {
                x: centerGroupX + (centerX - centerGroupX) * cos - (centerY - centerGroupY) * sin,
                y: centerGroupY + (centerX - centerGroupX) * sin + (centerY - centerGroupY) * cos,
            };
            res[layerId] = {
                boxSize: layer.boxSize,
                rotate: layer.rotate + degreeChange,
                position: {
                    x: layer.position.x + (centerGroup.x - centerX),
                    y: layer.position.y + (centerGroup.y - centerY),
                },
                scale: layer.scale,
            };
        });
        return res;
    };
    const handleRotate = throttle((e: MouseEvent | TouchEvent) => {
        if (!rotateRef.current) {
            return;
        }
        const { clientX, clientY } = getPosition(e);
        rotateRef.current.last = {
            clientX,
            clientY,
        };
        const radians = Math.atan2(
            clientY - pageOffset.y - rotateRef.current.centerY * scale,
            clientX - pageOffset.x - rotateRef.current.centerX * scale,
        );
        let degrees =
            (radians * 180) / Math.PI -
            (rotateRef.current.prevDegree < 230 && rotateRef.current.prevDegree > 130 ? 0 : 90);
        degrees = setRightAngle((degrees + 360) % 360);
        actions.setRotateData(true, degrees);
        if (selectedLayerIds.length === 1) {
            onRotate({
                controlBox: { ...controlBox, rotate: degrees },
                layers: {
                    [selectedLayers[0].id]: {
                        boxSize: selectedLayers[0].data.props.boxSize,
                        position: selectedLayers[0].data.props.position,
                        scale: selectedLayers[0].data.props.scale,
                        rotate: degrees,
                    },
                },
            });
        } else {
            onRotate({
                controlBox: { ...controlBox, rotate: degrees },
                layers: newLayerData(degrees),
            });
        }
    }, 16);

    const handleRotateEnd = () => {
        if (!rotateRef.current) {
            return;
        }
        const { clientX, clientY } = rotateRef.current.last;
        const radians = Math.atan2(
            clientY - pageOffset.y - rotateRef.current.centerY * scale,
            clientX - pageOffset.x - rotateRef.current.centerX * scale,
        );
        let degrees =
            (radians * 180) / Math.PI -
            (rotateRef.current.prevDegree < 230 && rotateRef.current.prevDegree > 130 ? 0 : 90);
        degrees = setRightAngle((degrees + 360) % 360);
        if (selectedLayerIds.length === 1) {
            onRotate({
                controlBox: { ...controlBox, rotate: degrees },
                layers: {
                    [selectedLayers[0].id]: {
                        boxSize: selectedLayers[0].data.props.boxSize,
                        position: selectedLayers[0].data.props.position,
                        scale: selectedLayers[0].data.props.scale,
                        rotate: degrees,
                    },
                },
            });
        } else {
            onRotate({
                controlBox: { ...controlBox, rotate: degrees },
                layers: newLayerData(degrees),
            });
        }
        rotateRef.current = undefined;
        actions.setRotateData(false);
        unbindEvents();
    };
    const bindEvents = () => {
        actions.history.new();
        window.addEventListener('touchmove', handleRotate);
        window.addEventListener('mousemove', handleRotate);
        window.addEventListener('mouseup', handleRotateEnd, { once: true });
        window.addEventListener('mouseleave', handleRotateEnd, { once: true });
        window.addEventListener('touchend', handleRotateEnd, { once: true });
    };
    const unbindEvents = () => {
        window.removeEventListener('touchmove', handleRotate);
        window.removeEventListener('mousemove', handleRotate);
        window.removeEventListener('mouseup', handleRotateEnd);
        window.removeEventListener('mouseleave', handleRotateEnd);
        window.removeEventListener('touchend', handleRotateEnd);
    };
    const startRotate = (e: TouchEvent | MouseEvent) => {
        const { clientX, clientY } = getPosition(e);
        const { centerX, centerY } = boundingRect(controlBox.boxSize, controlBox.position, controlBox.rotate);
        rotateRef.current = {
            centerX,
            centerY,
            last: { clientX, clientY },
            prevDegree: controlBox.rotate,
        };
        const layerData: LayerDataRef = {};
        selectedLayers.forEach((layer) => {
            const { centerX, centerY } = boundingRect(
                layer.data.props.boxSize,
                layer.data.props.position,
                layer.data.props.rotate,
            );
            layerData[layer.id] = cloneDeep({
                position: layer.data.props.position,
                boxSize: layer.data.props.boxSize,
                rotate: layer.data.props.rotate,
                scale: layer.data.props.scale,
                centerX: centerX,
                centerY: centerY,
            });
        });
        setControlBoxData(controlBox);
        setLayerData(layerData);
        actions.setRotateData(true, setRightAngle(controlBox.rotate));
        bindEvents();
    };
    return {
        startRotate,
    };
};
