import { FC } from 'react';
import { BoxSize, Delta, LayerComponentProps } from '../../types';
import { getTransformStyle } from '..';

export interface ImageContentProps extends LayerComponentProps {
    image: {
        url: string;
        thumb?: string;
        position: Delta;
        rotate: number;
        boxSize: BoxSize;
        transparency?: number;
    };
}
export const ImageContent: FC<ImageContentProps> = ({ image, boxSize }) => {
    return (
        <div
            css={{
                overflow: 'hidden',
                pointerEvents: 'auto',
                width: boxSize.width,
                height: boxSize.height,
            }}
        >
            <div
                css={{
                    width: image.boxSize.width,
                    height: image.boxSize.height,
                    transform: getTransformStyle({ position: image.position, rotate: image.rotate }),
                    position: 'relative',
                    userSelect: 'none',
                    opacity: image.transparency,
                }}
            >
                <img
                    src={image.url}
                    css={{
                        objectFit: 'fill',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        pointerEvents: 'none',
                    }}
                />
            </div>
        </div>
    );
};
