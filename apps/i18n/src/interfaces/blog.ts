export interface IBlog {
  listTitle: string;
  listSubtitle: string;
  searchPlaceholder: string;
  resultsFound: string; // e.g. "Found {count} articles"
  resultsAvailable: string; // e.g. "{count} articles available"
  emptyTitle: string;
  emptyDescriptionWithSearch: string;
  emptyDescriptionNoSearch: string;
  emptySuggestionsTitle: string;
  emptySuggestion1: string;
  emptySuggestion2: string;
  emptySuggestion3: string;

  sectionTitle: string;
  sectionSubtitle: string;
  viewAll: string;
  createProject;

  tagsLabel: string;
  commentsTitle: string;
  commentsCount: string; // e.g. "{count} comments"
  commentsEmpty: string;
  commentsLoginTitle: string;
  commentsLoginDescription: string;
  commentsLoginCta: string;

  shareLabel: string;
  shareTwitter: string;
  shareFacebook: string;
  shareLinkedIn: string;
  shareCopy: string;
  shareCopied: string;

  noArticlesYet: string;

  // Message shown when a post isn't available in the current language
  // and the default locale content is displayed instead
  unavailableInLanguage: string;
}

