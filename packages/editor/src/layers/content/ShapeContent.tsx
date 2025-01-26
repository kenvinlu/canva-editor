import { FC } from 'react';
import {
  GradientStyle,
  LayerComponentProps,
  ShapeBorderStyle,
} from '../../types';
import { getGradientBackground } from '..';
import { roundCorners } from 'canva-editor/utils/svgRounding';
import { parse } from 'canva-editor/utils/svgRounding/parse';
import { serialize } from 'canva-editor/utils/svgRounding/serialize';

export interface ShapeContentProps extends LayerComponentProps {
  clipPath: string;
  scale: number;
  roundedCorners: number;
  gradientBackground: {
    colors: string[];
    style: GradientStyle;
  } | null;
  color: string;
  border: {
    style: ShapeBorderStyle;
    weight: number;
    color: string;
  } | null;
  shapeSize: {
    width: number;
    height: number;
  };
}
export const ShapeContent: FC<ShapeContentProps> = ({
  clipPath,
  color,
  gradientBackground,
  boxSize,
  scale,
  border,
  roundedCorners,
  shapeSize,
}) => {
  const getDashArray = () => {
    switch (border?.style) {
      case 'longDashes':
        return `${border.weight * 6}, ${border.weight}`;
      case 'shortDashes':
        return `${border.weight * 3}, ${border.weight}`;
      case `dots`:
        return `${border.weight}, ${border.weight}`;
      default:
        return undefined;
    }
  };
  const deductBorder = border?.weight ? border?.weight / 2 : 0;
  const boxSizeWidth = (boxSize.width / scale) - deductBorder;
  const boxSizeHeight = (boxSize.height / scale) - deductBorder;
  const svgWidth = boxSizeWidth / shapeSize.width;
  const svgHeight = boxSizeHeight / shapeSize.height;
  const path = roundedCorners > 0 ? serialize(roundCorners(parse(clipPath), roundedCorners)) : clipPath;

  return (
    <div
      css={{
        position: 'relative',
        width: boxSize.width / scale,
        height: boxSize.height / scale,
        overflow: 'hidden'
      }}
    >
      <div
        css={{
          clipPath: `path("${path}")`,
          width: shapeSize.width + 'px',
          height: shapeSize.height + 'px',
          background: gradientBackground
            ? getGradientBackground(
                gradientBackground.colors,
                gradientBackground.style
              )
            : color,
          transform: `scale(${svgWidth}, ${svgHeight})`,
          transformOrigin: '0 0',
        }}
      />
      {border && (
        <svg
          viewBox={`${0 - deductBorder} ${0 - deductBorder} ${boxSize.width / scale + (border?.weight ?? 0)} ${boxSize.height / scale  + (border?.weight ?? 0)}`}
          css={{
            position: 'absolute',
            inset: 0,
            transform: `scale(${svgWidth}, ${svgHeight})`,
            transformOrigin: '0 0',
          }}
        >
          <path
            d={path}
            strokeLinecap={'butt'}
            fill={'none'}
            stroke={border.color}
            strokeWidth={border.weight}
            strokeDasharray={getDashArray()}
            clipPath={clipPath}
            vectorEffect={'non-scaling-stroke'}
          />
        </svg>
      )}
    </div>
  );
};
