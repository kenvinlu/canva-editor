import type { Image } from "./image.model";

export type Template = {
    id: number;
    title: string;
    documentId: string;
    img: Image;
    data?: any;
    vote?: number;
    desc: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string | null;
    locale?: string | null;
}