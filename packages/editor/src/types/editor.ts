import { Direction } from './resize';
import {
  BoxData,
  BoxSize,
  CursorPosition,
  Delta,
  FontData,
  LayerId,
  PageSize,
} from 'canva-editor/types';
import { HorizontalGuideline, VerticalGuideline } from './common';
import { Page } from './page';
import { TextEditor } from 'canva-editor/components/text-editor/interfaces';
import { QueryMethods } from 'canva-editor/components/editor/query';
import { ActionMethods } from 'canva-editor/components/editor/actions';

export type DataConfig = {
  name: string;
  editorConfig: any;
};

export type ImageEditorData = {
  layerId: LayerId;
  pageIndex: number;
  position: Delta;
  rotate: number;
  boxSize: BoxSize;
  image?: {
    url: string;
    position: Delta;
    rotate: number;
    boxSize: BoxSize;
  } | null;
};
export type SidebarType =
  | 'TEXT_EFFECT'
  | 'FONT_FAMILY'
  | 'LAYER_MANAGEMENT'
  | 'CHOOSING_COLOR';

export interface EditorState {
  name: string;
  scale: number;
  selectedLayers: Record<number, LayerId[]>;
  hoveredLayer: Record<number, LayerId | null>;
  openMenu: {
    clientX: number;
    clientY: number;
  } | null;
  imageEditor?: ImageEditorData;
  textEditor?: {
    pageIndex: number;
    layerId: LayerId;
    editor: TextEditor | null;
  };
  controlBox?: BoxData;
  guideline: {
    horizontal: HorizontalGuideline[];
    vertical: VerticalGuideline[];
  };
  activePage: number;
  openPageSettings: boolean;
  sideBarTab: string | null;
  pageSize: PageSize;
  pages: Page[];
  sidebar: SidebarType | null;
  fontList: FontData[];
  resizeData: {
    status: boolean;
    layerIds?: LayerId[];
    direction?: Direction;
    rotate?: number;
    boxSize?: BoxSize;
    cursor?: CursorPosition;
  };
  selectData: {
    status: boolean;
  };
  dragData: {
    status: boolean;
    layerIds?: LayerId[];
    position?: Delta;
    cursor?: CursorPosition;
  };
  rotateData: {
    status: boolean;
    rotate?: number;
    cursor?: CursorPosition;
  };
  downloadPNGCmd: -1 | 0 | 1;
  downloadPDFCmd: -1 | 0 | 1;
  saving: boolean;
  githubLink: string;
  gumroadLink: string;
}

export type CoreEditorActions = ReturnType<typeof ActionMethods>;

export type HistoryActions = {
  undo: () => void;
  redo: () => void;
  clear: () => void;
  new: () => void;
  ignore: () => CoreEditorActions;
  merge: () => CoreEditorActions;
  throttle: (rate: number) => CoreEditorActions;
  back: () => void;
};

export type CoreEditorQuery = ReturnType<typeof QueryMethods>;

export interface EditorQuery extends CoreEditorQuery {
  history: {
    canUndo: () => boolean;
    canRedo: () => boolean;
  };
}

export type EditorActions = CoreEditorActions & {
  history: HistoryActions;
};
