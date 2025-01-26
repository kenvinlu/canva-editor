import { LayerComponent } from 'canva-editor/types';
import { FrameContent, FrameContentProps } from './content/FrameContent';
import { useEditor, useLayer, useSelectedLayers } from 'canva-editor/hooks';
import { useEffect, useState } from 'react';

export type FrameLayerProps = FrameContentProps;
const FrameLayer: LayerComponent<FrameLayerProps> = ({
  boxSize,
  clipPath,
  scale = 1,
  rotate,
  position,
  image,
  color,
  gradientBackground,
}) => {
  const { actions, pageIndex, id } = useLayer();
  const { selectedLayerIds } = useSelectedLayers();
  const [newImg, setNewImg] = useState<any>(null);
  const { imageEditor } = useEditor((state) => ({
    imageEditor: state.imageEditor,
  }));
  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        setNewImg(
          (i: any) =>
            i && {
              ...i,
              url: img.src,
            }
        );
      };
      img.src = image.url;
    }
  }, [image]);
  useEffect(() => {
    if (image) {
      setNewImg(image);
    }
  }, [image, color, gradientBackground]);

  const handleDoubleClick = () => {
    image &&
      selectedLayerIds.includes(id) &&
      actions.openImageEditor({
        boxSize,
        position,
        rotate,
        image: {
          boxSize: {
            width: image.boxSize.width * scale,
            height: image.boxSize.height * scale,
          },
          position: {
            x: image.position.x * scale,
            y: image.position.y * scale,
          },
          rotate: image.rotate || 0,
          url: image.url,
        },
      });
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
        visibility:
          imageEditor &&
          imageEditor.pageIndex === pageIndex &&
          imageEditor.layerId === id
            ? 'hidden'
            : void 0,
      }}
      onDoubleClick={handleDoubleClick}
    >
      <FrameContent
        boxSize={boxSize}
        clipPath={clipPath}
        scale={scale}
        rotate={rotate}
        position={position}
        image={newImg}
        color={color}
        gradientBackground={gradientBackground}
      />
    </div>
  );
};

FrameLayer.info = {
  name: 'Frame',
  type: 'Frame',
};
export default FrameLayer;
