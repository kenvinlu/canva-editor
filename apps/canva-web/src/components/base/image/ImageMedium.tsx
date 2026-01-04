import type { ImageProps } from ".";
import { IMAGE_WIDTH_MEDIUM } from ".";
import ImageWithFallback from "./ImageWithFallback";

export default function ImageMedium(props: ImageProps) {
  const { aspectRatio = 3/2, ...rest } = props;
  return (
    <ImageWithFallback
      {...{
        ...rest,
        width: props.width || IMAGE_WIDTH_MEDIUM,
        height: props.height || Math.round(IMAGE_WIDTH_MEDIUM / aspectRatio),
      }}
    />
  );
}
