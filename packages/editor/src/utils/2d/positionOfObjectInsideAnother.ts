import { BoxData } from 'canva-editor/types';
import { boundingRect } from './boundingRect';

export const positionOfObjectInsideAnother = (parent: BoxData, child: BoxData) => {
    const boxRect = boundingRect(parent.boxSize, parent.position, parent.rotate);
    const imageRect = boundingRect(
        child.boxSize,
        {
            x: parent.position.x + child.position.x * (parent.scale || 1),
            y: parent.position.y + child.position.y * (parent.scale || 1),
        },
        parent.rotate,
    );
    const centerGroupX = boxRect.centerX;
    const centerGroupY = boxRect.centerY;
    const centerX = imageRect.centerX;
    const centerY = imageRect.centerY;
    const cos = Math.cos((parent.rotate * Math.PI) / 180);
    const sin = Math.sin((parent.rotate * Math.PI) / 180);
    const centerGroup = {
        x: centerGroupX + (centerX - centerGroupX) * cos - (centerY - centerGroupY) * sin,
        y: centerGroupY + (centerX - centerGroupX) * sin + (centerY - centerGroupY) * cos,
    };
    const changeX = centerGroup.x - centerX;
    const changeY = centerGroup.y - centerY;
    return {
        x: parent.position.x + child.position.x * (parent.scale || 1) + changeX,
        y: parent.position.y + child.position.y * (parent.scale || 1) + changeY,
        rotate: parent.rotate + child.rotate,
    };
};
