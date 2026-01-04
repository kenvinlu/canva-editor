import { FC } from 'react';
import {
  BoxSize,
  Delta,
  GradientStyle,
  LayerComponentProps,
} from '../../types';
import { getGradientBackground, getTransformStyle } from '..';

export interface FrameContentProps extends LayerComponentProps {
  clipPath: string;
  scale: number;
  gradientBackground: {
    colors: string[];
    style: GradientStyle;
  } | null;
  color: string;
  image: {
    boxSize: BoxSize;
    position: Delta;
    rotate: number;
    thumb: string;
    url: string;
  };
}
export const FrameContent: FC<FrameContentProps> = ({
  clipPath,
  image,
  color,
  gradientBackground,
}) => {
  return (
    <div
      css={{
        clipPath,
        width: '100%',
        height: '100%',
        background: gradientBackground
          ? getGradientBackground(
              gradientBackground.colors,
              gradientBackground.style
            )
          : color,
      }}
    >
      {image && (
        <div
          css={{
            width: image.boxSize.width + 'px',
            height: image.boxSize.height + 'px',
            transform: getTransformStyle({
              position: image.position,
              rotate: image.rotate,
            }),
            position: 'relative',
            userSelect: 'none',
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
      )}
    </div>
  );
};
