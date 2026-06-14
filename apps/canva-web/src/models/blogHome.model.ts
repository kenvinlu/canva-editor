import type { Article } from './cms.model';

export type BlogHomeSectionType =
  | 'sections.hero-slideshow'
  | 'sections.card-slider'
  | 'sections.column-list';

export interface BlogHomeSectionBase {
  __component: BlogHomeSectionType;
  id: number;
  title?: string;
  articles?: Article[];
}

export interface HeroSlideshowSection extends BlogHomeSectionBase {
  __component: 'sections.hero-slideshow';
  subtitle?: string;
}

export interface CardSliderSection extends BlogHomeSectionBase {
  __component: 'sections.card-slider';
}

export interface ColumnListSection extends BlogHomeSectionBase {
  __component: 'sections.column-list';
  columns?: number | null;
}

export type BlogHomeSection =
  | HeroSlideshowSection
  | CardSliderSection
  | ColumnListSection;

export interface BlogHome {
  id: number;
  documentId: string;
  title?: string;
  slug?: string;
  sections?: BlogHomeSection[];
}


