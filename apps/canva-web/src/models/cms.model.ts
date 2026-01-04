import { Image } from './image.model';

export type Article = {
  id: number;
  documentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  description: string;
  slug: string;
  content: string;
  cover: Image;
  author: Author;
  categories: Category[];
  tags: Tag[];
};

export type Author = {
  id: number;
  name: string;
  avatar: Image;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type Tag = {
  id: number;
  name: string;
  slug: string;
};

export type Comment = {
  id: number;
  documentId?: string;
  content: string;
  blocked?: boolean;
  blockedThread?: boolean;
  blockReason?: string | null;
  isAdminComment?: boolean | null;
  removed?: boolean | null;
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  related?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  locale?: string | null;
  reports?: unknown[];
  threadOf?: Comment | number | null;
  gotThread?: boolean;
  author: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
};