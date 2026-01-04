import { FC, HTMLProps } from 'react';
import { GradientStyle, LayerComponentProps } from '../../types';
import { getGradientBackground, ImageContent, ImageContentProps } from '..';

export interface RootContentProps extends LayerComponentProps, Omit<HTMLProps<HTMLDivElement>, 'color'> {
    color: string | null;
    gradientBackground: {
        colors: string[];
        style: GradientStyle;
    } | null;
    image?: ImageContentProps['image'] | null;
}
export const RootContent: FC<RootContentProps> = ({
    boxSize,
    color,
    gradientBackground,
    image,
    position,
    rotate,
    ...props
}) => {
    return (
        <div
            css={{
                position: 'absolute',
                overflow: 'hidden',
                pointerEvents: 'auto',
                width: boxSize.width,
                height: boxSize.height,
            }}
            {...props}
        >
            <div
                css={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: boxSize.width,
                    height: boxSize.height,
                    background: gradientBackground
                        ? getGradientBackground(gradientBackground.colors, gradientBackground.style)
                        : color || '#fff',
                }}
            />
            {image && (
                <div css={{ width: boxSize.width, height: boxSize.height }}>
                    <ImageContent image={image} boxSize={boxSize} rotate={rotate} position={position} />
                </div>
            )}
        </div>
    );
};
