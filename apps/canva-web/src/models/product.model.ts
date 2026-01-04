import { Image } from "./image.model";

export type Product = {
  id: number;
  slug: string;
  documentId: string;
  name: string;
  price: number;
  short_description: string;
  description: string;
  digital_file_url: string;
  images: Image[];
};