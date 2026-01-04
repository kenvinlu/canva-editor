import type { Image } from "./image.model";

export type Project = {
    id: number;
    title?: string;
    documentId?: string;
    img: Image;
    data?: any;
    desc: string;
    pages: number;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string | null;
    locale?: string | null;
    templateId: number;
    user: number;
}
