export type BoxSize = {
  width: number;
  height: number;
};
export type Delta = {
  x: number;
  y: number;
};

export type CursorPosition = {
  clientX: number;
  clientY: number;
};

export type FontStyle = {
  name: string;
  style: string;
  url: string;
};

export type FontDataApi = {
  family: string;
  styles: FontStyle[];
};

export type FontData = {
  name: string;
  family: string;
  style: string;
  url: string;
  styles?: FontData[];
};

export type HorizontalGuideline = {
  y: number;
  x1: number;
  x2: number;
  label?: string;
};
export type VerticalGuideline = {
  x: number;
  y1: number;
  y2: number;
  label?: string;
};

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
export type GetFontQuery = Partial<{
  ps: string;
  pi: string;
  kw: string;
}>;

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type GestureEvent = UIEvent & {
  scale: number;
  rotation: number;
};

export interface IconProps {
  className?: string;
  style?: any;
  fill?: string;
}

export type SearchResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
};

export type ImageData = {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: {
    large: ImageFormat;
    small: ImageFormat;
    medium: ImageFormat;
    thumbnail: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: {
    public_id: string;
    resource_type: string;
  };
  folderPath: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
}

export type ImageFormat = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
  provider_metadata: {
    public_id: string;
    resource_type: string;
  };
}