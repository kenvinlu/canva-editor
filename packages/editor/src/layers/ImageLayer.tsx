import React, { useEffect, useState } from 'react';
import { useLayer, useEditor, useSelectedLayers } from '../hooks';
import { Delta, BoxSize, LayerComponent } from 'canva-editor/types';
import { ImageContentProps, ImageContent } from '.';

export interface ImageLayerProps extends ImageContentProps {
    image: {
        url: string;
        thumb: string;
        position: Delta;
        rotate: number;
        boxSize: BoxSize;
        transparency?: number;
    };
}

const ImageLayer: LayerComponent<ImageLayerProps> = ({ image, boxSize, position, rotate }) => {
    const { actions, pageIndex, id } = useLayer();
    const { selectedLayerIds } = useSelectedLayers();
    const { imageEditor } = useEditor((state) => ({ imageEditor: state.imageEditor }));
    const [imageData, setImageData] = useState<ImageLayerProps['image']>({ ...image, url: image.thumb });
    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            setImageData((prevState) => ({ ...prevState, url: image.url }));
        };
        img.src = image.url;
    }, [image, setImageData]);

    useEffect(() => {
        setImageData(image);
    }, [image]);
    return (
        <div
            css={{
                pointerEvents: 'auto',
                visibility:
                    imageEditor && imageEditor.pageIndex === pageIndex && imageEditor.layerId === id
                        ? 'hidden'
                        : undefined,
            }}
            onDoubleClick={() =>
                selectedLayerIds.includes(id) && actions.openImageEditor({ position, rotate, boxSize, image })
            }
        >
            <ImageContent image={imageData} boxSize={boxSize} rotate={rotate} position={position} />
        </div>
    );
};

ImageLayer.info = {
    name: 'Image',
    type: 'Image',
};
export default ImageLayer;
