export interface Doc {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  content: string;
  updatedAt: string;
}

export type DocsData = Doc[];
