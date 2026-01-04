import { FC, useMemo } from 'react';
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

  // Calculate the actual rendered size
  const renderedWidth = boxSize.width / scale;
  const renderedHeight = boxSize.height / scale;

  // Calculate scale factors for non-uniform scaling
  const scaleX = renderedWidth / shapeSize.width;
  const scaleY = renderedHeight / shapeSize.height;

  // Keep corner radius consistent like a fixed pixel value
  // Scale the corner radius to make it more visible and responsive
  // Using minScale ensures corners stay circular while being appropriately sized
  const minScale = Math.min(scaleX, scaleY);
  const actualCornerRadius = roundedCorners * minScale;

  // Apply rounded corners at the scaled size to get true circular arcs
  const roundedPath = useMemo(() => {
    if (roundedCorners > 0) {
      // First transform the path, then apply corner rounding at the final size
      const pathData = parse(clipPath);
      const scaledCommands = pathData.map(cmd => {
        const newCmd: any = { ...cmd };
        if ('x' in cmd && typeof cmd.x === 'number') {
          newCmd.x = cmd.x * scaleX;
        }
        if ('y' in cmd && typeof cmd.y === 'number') {
          newCmd.y = cmd.y * scaleY;
        }
        if ('x1' in cmd && typeof cmd.x1 === 'number') {
          newCmd.x1 = cmd.x1 * scaleX;
        }
        if ('y1' in cmd && typeof cmd.y1 === 'number') {
          newCmd.y1 = cmd.y1 * scaleY;
        }
        if ('x2' in cmd && typeof cmd.x2 === 'number') {
          newCmd.x2 = cmd.x2 * scaleX;
        }
        if ('y2' in cmd && typeof cmd.y2 === 'number') {
          newCmd.y2 = cmd.y2 * scaleY;
        }
        return newCmd;
      });
      const scaledPath = serialize(scaledCommands);
      // Now apply corner rounding with the actual pixel radius
      return serialize(roundCorners(parse(scaledPath), actualCornerRadius));
    }
    // If no rounded corners, still need to scale the path
    const pathData = parse(clipPath);
    const scaledCommands = pathData.map(cmd => {
      const newCmd: any = { ...cmd };
      if ('x' in cmd && typeof cmd.x === 'number') {
        newCmd.x = cmd.x * scaleX;
      }
      if ('y' in cmd && typeof cmd.y === 'number') {
        newCmd.y = cmd.y * scaleY;
      }
      if ('x1' in cmd && typeof cmd.x1 === 'number') {
        newCmd.x1 = cmd.x1 * scaleX;
      }
      if ('y1' in cmd && typeof cmd.y1 === 'number') {
        newCmd.y1 = cmd.y1 * scaleY;
      }
      if ('x2' in cmd && typeof cmd.x2 === 'number') {
        newCmd.x2 = cmd.x2 * scaleX;
      }
      if ('y2' in cmd && typeof cmd.y2 === 'number') {
        newCmd.y2 = cmd.y2 * scaleY;
      }
      return newCmd;
    });
    return serialize(scaledCommands);
  }, [clipPath, roundedCorners, scaleX, scaleY, actualCornerRadius]);

  // Transform the path to account for non-uniform scaling
  const transformedPath = roundedPath;

  // Calculate inset path for border inner edge
  const borderInsetPath = useMemo(() => {
    if (!border || roundedCorners <= 0) {
      // For non-rounded borders, we still need an inset path
      const pathData = parse(clipPath);
      const scaledCommands = pathData.map(cmd => {
        const newCmd: any = { ...cmd };
        if ('x' in cmd && typeof cmd.x === 'number') {
          newCmd.x = cmd.x * scaleX;
        }
        if ('y' in cmd && typeof cmd.y === 'number') {
          newCmd.y = cmd.y * scaleY;
        }
        if ('x1' in cmd && typeof cmd.x1 === 'number') {
          newCmd.x1 = cmd.x1 * scaleX;
        }
        if ('y1' in cmd && typeof cmd.y1 === 'number') {
          newCmd.y1 = cmd.y1 * scaleY;
        }
        if ('x2' in cmd && typeof cmd.x2 === 'number') {
          newCmd.x2 = cmd.x2 * scaleX;
        }
        if ('y2' in cmd && typeof cmd.y2 === 'number') {
          newCmd.y2 = cmd.y2 * scaleY;
        }
        return newCmd;
      });
      return serialize(scaledCommands);
    }
    
    // Calculate the inset corner radius (subtract border weight)
    const insetRadius = Math.max(0, actualCornerRadius - border.weight);
    
    // Parse the original path and create an inset version
    const pathData = parse(clipPath);
    const insetCommands = pathData.map(cmd => {
      const newCmd: any = { ...cmd };
      // Scale coordinates
      if ('x' in cmd && typeof cmd.x === 'number') {
        newCmd.x = cmd.x * scaleX;
      }
      if ('y' in cmd && typeof cmd.y === 'number') {
        newCmd.y = cmd.y * scaleY;
      }
      if ('x1' in cmd && typeof cmd.x1 === 'number') {
        newCmd.x1 = cmd.x1 * scaleX;
      }
      if ('y1' in cmd && typeof cmd.y1 === 'number') {
        newCmd.y1 = cmd.y1 * scaleY;
      }
      if ('x2' in cmd && typeof cmd.x2 === 'number') {
        newCmd.x2 = cmd.x2 * scaleX;
      }
      if ('y2' in cmd && typeof cmd.y2 === 'number') {
        newCmd.y2 = cmd.y2 * scaleY;
      }
      return newCmd;
    });
    
    const insetScaledPath = serialize(insetCommands);
    // Apply the inset corner radius
    return serialize(roundCorners(parse(insetScaledPath), insetRadius));
  }, [clipPath, border, roundedCorners, actualCornerRadius, scaleX, scaleY]);

  const uniqueId = useMemo(() => Math.random().toString(36).substr(2, 9), []);

  return (
    <div
      css={{
        position: 'relative',
        width: renderedWidth,
        height: renderedHeight,
        overflow: 'hidden',
      }}
    >
      {/* Shape fill with clipping */}
      <svg
        viewBox={`0 0 ${renderedWidth} ${renderedHeight}`}
        css={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          <clipPath id={`shape-clip-${uniqueId}`}>
            <path d={transformedPath} />
          </clipPath>
        </defs>
        <rect
          x={0}
          y={0}
          width={renderedWidth}
          height={renderedHeight}
          fill={
            gradientBackground
              ? getGradientBackground(
                  gradientBackground.colors,
                  gradientBackground.style
                )
              : color
          }
          clipPath={`url(#shape-clip-${uniqueId})`}
        />
      </svg>

      {/* Border with curved inside edge */}
      {border && (
        <svg
          viewBox={`0 0 ${renderedWidth} ${renderedHeight}`}
          css={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <defs>
            {/* Outer shape clip */}
            <clipPath id={`border-outer-${uniqueId}`}>
              <path d={transformedPath} />
            </clipPath>
            {/* Inner inset clip */}
            <mask id={`border-mask-${uniqueId}`}>
              <rect width={renderedWidth} height={renderedHeight} fill="white" />
              <path d={borderInsetPath} fill="black" />
            </mask>
          </defs>
          {/* Fill the space between outer and inner paths */}
          <path
            d={transformedPath}
            fill={border.color}
            clipPath={`url(#border-outer-${uniqueId})`}
            mask={`url(#border-mask-${uniqueId})`}
          />
          {/* Add dashed/dotted pattern if needed */}
          {border.style !== 'none' && (
            <path
              d={transformedPath}
              fill="none"
              stroke={border.color}
              strokeWidth={border.weight * 2}
              strokeDasharray={getDashArray()}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              clipPath={`url(#border-outer-${uniqueId})`}
            />
          )}
        </svg>
      )}
    </div>
  );
};