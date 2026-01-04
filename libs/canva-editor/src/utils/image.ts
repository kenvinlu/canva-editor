import { ImageData } from 'canva-editor/types';

export const getBestImageFormat = (image: ImageData) => {
  if (!image) {
    return {
      url: '',
    };
  }

  // Check formats in priority order
  const format =
    image.formats?.large ||
    image ||
    image.formats?.medium ||
    image.formats?.small ||
    image.formats?.thumbnail;

  return {
    url: format.url,
  };
};
