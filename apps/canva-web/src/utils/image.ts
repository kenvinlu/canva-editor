import type { Image } from "../models/image.model";

export const getBestImageFormat = (image: Image) => {
  if (!image) {
    return {
      url: '',
    };
  }

  // Check formats in priority order
  const format =
    image.formats?.large ||
    image.formats?.medium ||
    image.formats?.small ||
    image.formats?.thumbnail;

  return {
    url: format?.url || image.url,
    width: format?.width || image.width,
    height: format?.height || image.height,
  };
};
