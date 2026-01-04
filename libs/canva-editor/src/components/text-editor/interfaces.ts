import { EditorView } from 'prosemirror-view';
import { EventEmitter } from './core/helper/EventEmitter';

export type TextEditor = EditorView & {
    events: EventEmitter;
};
