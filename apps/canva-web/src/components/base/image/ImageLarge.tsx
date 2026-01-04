import type { ImageProps } from '.';
import { IMAGE_WIDTH_LARGE } from '.';
import ImageWithFallback from './ImageWithFallback';

export default function ImageLarge(props: ImageProps) {
  const {
    aspectRatio = 3/2,
    ...rest
  } = props;
  return (
    <ImageWithFallback {...{
      ...rest,
      width: IMAGE_WIDTH_LARGE,
      height: Math.round(IMAGE_WIDTH_LARGE / aspectRatio),
      quality: 100, // Configurable
    }} />
  );
};