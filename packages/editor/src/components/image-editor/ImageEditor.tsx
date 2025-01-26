import { useRef } from 'react';
import { useEditor } from '../../hooks';
import ImageEditorControl from './ImageEditorControl';
import { positionOfObjectInsideAnother } from 'canva-editor/utils/2d/positionOfObjectInsideAnother';
import { getTransformStyle, scalePath } from 'canva-editor/layers';
import { isFrameLayer } from 'canva-editor/utils/layer/layers';

const ImageEditor = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const { imageEditor, originalLayer, scale } = useEditor((state) => {
    const imageEditor = state.imageEditor;
    return {
      imageEditor,
      scale: state.scale,
      originalLayer: imageEditor
        ? state.pages[imageEditor.pageIndex].layers[imageEditor.layerId]
        : null,
    };
  });
  const layer = imageEditor?.image;
  if (!imageEditor || !originalLayer || !layer) {
    return null;
  }
  const mergeData = positionOfObjectInsideAnother(imageEditor, layer);

  return (
    <div css={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <div
        css={{
          width: layer.boxSize.width * scale,
          height: layer.boxSize.height * scale,
          left: 0,
          top: 0,
          position: 'absolute',
          transform: getTransformStyle({
            position: {
              x: mergeData.x * scale,
              y: mergeData.y * scale,
            },
            rotate: mergeData.rotate,
          }),
          opacity: 0.5,
        }}
      >
        <div css={{ width: '100%', height: '100%' }}>
          {imageEditor.image && (
            <img
              src={layer.url}
              crossOrigin='anonymous'
              css={{
                display: 'block',
                height: '100%',
                width: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                objectFit: 'fill',
              }}
            />
          )}
        </div>
      </div>
      <div
        ref={boxRef}
        css={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: imageEditor.boxSize.width * scale,
          height: imageEditor.boxSize.height * scale,
          transform: getTransformStyle({
            position: {
              x: imageEditor.position.x * scale,
              y: imageEditor.position.y * scale,
            },
            rotate: imageEditor.rotate,
          }),
          overflow: 'hidden',
          clipPath: isFrameLayer(originalLayer)
            ? scalePath(
                originalLayer.data.props.clipPath,
                originalLayer.data.props.scale * scale
              )
            : void 0,
        }}
      >
        <div
          css={{
            width: layer.boxSize.width * scale,
            height: layer.boxSize.height * scale,
            transform: getTransformStyle({
              position: {
                x: layer.position.x * scale,
                y: layer.position.y * scale,
              },
              rotate: layer.rotate,
            }),
            opacity: 1,
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        >
          <div css={{ width: '100%', height: '100%' }}>
            {imageEditor.image && (
              <img
                src={layer.url}
                crossOrigin='anonymous'
                css={{
                  display: 'block',
                  height: '100%',
                  width: '100%',
                  position: 'absolute',
                  pointerEvents: 'none',
                  objectFit: 'fill',
                }}
              />
            )}
          </div>
        </div>
      </div>
      <ImageEditorControl />
    </div>
  );
};

export default ImageEditor;
