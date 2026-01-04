import { BoxData, LayerComponentProps, LayerId } from 'canva-editor/types';
import { boundingRect } from '../2d/boundingRect';

export const getControlBoxSizeFromLayers = (data: Record<LayerId, LayerComponentProps>): BoxData | undefined => {
    if (Object.keys(data).length > 1) {
        const position: { left: number; top: number; right: number; bottom: number } = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        };
        Object.values(data).forEach((props, index) => {
            const rect = boundingRect(props.boxSize, props.position, props.rotate);
            position.left = index === 0 ? rect.x : Math.min(position.left, rect.x);
            position.top = index === 0 ? rect.y : Math.min(position.top, rect.y);
            position.right = Math.max(position.right, rect.x + rect.width);
            position.bottom = Math.max(position.bottom, rect.y + rect.height);
        });
        return {
            position: {
                x: position.left,
                y: position.top,
            },
            boxSize: {
                width: position.right - position.left,
                height: position.bottom - position.top,
            },
            rotate: 0,
        };
    } else if (Object.keys(data).length === 1) {
        const props = Object.values(data)[0];
        return {
            position: {
                x: props.position.x,
                y: props.position.y,
            },
            boxSize: {
                width: props.boxSize.width,
                height: props.boxSize.height,
            },
            rotate: props.rotate,
            scale: props.scale,
        };
    }
    return;
};
