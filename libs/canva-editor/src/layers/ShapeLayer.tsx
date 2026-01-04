import { LayerComponent } from 'canva-editor/types';
import { ShapeContent, ShapeContentProps } from './content/ShapeContent';

export type ShapeLayerProps = ShapeContentProps;
const ShapeLayer: LayerComponent<ShapeLayerProps> = ({
  boxSize,
  clipPath,
  scale = 1,
  rotate,
  position,
  color,
  gradientBackground,
  roundedCorners = 0,
  border,
  shapeSize,
}) => {
  const handleDoubleClick = () => {
    // TODO: Add text
  };
  return (
    <div
      css={{
        transformOrigin: '0 0',
      }}
      style={{
        width: boxSize.width / (scale || 1),
        height: boxSize.height / (scale || 1),
        transform: `scale(${scale || 1})`,
      }}
      onDoubleClick={handleDoubleClick}
    >
      <ShapeContent
        boxSize={boxSize}
        shapeSize={shapeSize}
        clipPath={clipPath}
        scale={scale}
        rotate={rotate}
        position={position}
        color={color}
        gradientBackground={gradientBackground}
        border={border}
        roundedCorners={roundedCorners}
      />
    </div>
  );
};

ShapeLayer.info = {
  name: 'Shape',
  type: 'Shape',
};
export default ShapeLayer;
