'use client';

import {
  EditorActions,
  EditorQuery,
  EditorState,
  EditorConfig,
} from 'canva-editor/types';
import { createContext } from 'react';

export type EditorContextType = {
  getState: () => EditorState;
  query: EditorQuery;
  actions: EditorActions;
  config: EditorConfig;
};

const defaultContext: EditorContextType = {
  getState: () => ({} as EditorState),
  query: {} as EditorQuery,
  actions: {} as EditorActions,
  config: {
    logoUrl: '',
    logoComponent: undefined,
    apis: {
      url: '',
      userToken: '',
      searchFonts: '',
      searchTemplates: '',
      searchTexts: '',
      searchImages: '',
      searchShapes: '',
      searchFrames: '',
      fetchUserImages: '',
      uploadUserImage: '',
      removeUserImage: '',
      templateKeywordSuggestion: '',
      textKeywordSuggestion: '',
      imageKeywordSuggestion: '',
      shapeKeywordSuggestion: '',
      frameKeywordSuggestion: '',
    },
    unsplash: {
      accessKey: '',
      pageSize: 30,
    },
    editorAssetsUrl: '',
  },
};

export const EditorContext = createContext<EditorContextType>(defaultContext);
