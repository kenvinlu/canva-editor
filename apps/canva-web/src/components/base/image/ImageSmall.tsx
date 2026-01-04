import type { ImageProps } from ".";
import { IMAGE_WIDTH_SMALL } from ".";
import ImageWithFallback from "./ImageWithFallback";

export default function ImageSmall(props: ImageProps) {
  const { aspectRatio = 3/2, ...rest } = props;
  return (
    <ImageWithFallback
      {...{
        ...rest,
        width: IMAGE_WIDTH_SMALL,
        height: Math.round(IMAGE_WIDTH_SMALL / aspectRatio),
      }}
    />
  );
}
