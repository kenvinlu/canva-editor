import ImageLarge from "./ImageLarge";
import ImageMedium from "./ImageMedium";
import ImageSmall from "./ImageSmall";

// Height determined by intrinsic photo aspect ratio
export const IMAGE_WIDTH_SMALL = 50;
// Height determined by intrinsic photo aspect ratio
export const IMAGE_WIDTH_MEDIUM = 300;
// Height determined by intrinsic photo aspect ratio
export const IMAGE_WIDTH_LARGE = 1000;

export type ImageProps = {
  aspectRatio?: number;
  className?: string;
  imgClassName?: string;
  src: string;
  alt: string;
  blurDataURL?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}
export { ImageSmall, ImageMedium, ImageLarge };
