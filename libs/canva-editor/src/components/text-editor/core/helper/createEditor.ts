import { EditorState } from 'prosemirror-state';
import { DOMParser, Schema } from 'prosemirror-model';
import { buildInputRules } from '../plugins/inputrules';
import { baseKeymap } from 'prosemirror-commands';
import { gapCursor } from 'prosemirror-gapcursor';
import { history } from 'prosemirror-history';
import { EditorProps, EditorView } from 'prosemirror-view';
import { schema } from '../schema/schema';
import { EventEmitter } from './EventEmitter';
import { TextEditor } from '../../interfaces';
import { keymap } from '../plugins/keymap';
import { buildKeyMap } from '../plugins/buildKeyMap';
import events from '../plugins/events';

const editorSchema = new Schema({
    nodes: schema.spec.nodes,
    marks: schema.spec.marks,
});
export const createEditor = ({
    content,
    ele = null,
    handleDOMEvents = {},
}: {
    content: string;
    ele?: HTMLDivElement | null;
    handleDOMEvents?: EditorProps['handleDOMEvents'];
}) => {
    const div = document.createElement('div');
    div.innerHTML = content;
    const state = EditorState.create({
        doc: DOMParser.fromSchema(editorSchema).parse(div),
        plugins: [
            buildInputRules(editorSchema),
            keymap(buildKeyMap(editorSchema)),
            keymap(baseKeymap),
            gapCursor(),
            history(),
            events(),
        ],
    });
    const editor = new EditorView(ele, {
        attributes: { class: 'canva-editor-text' },
        state,
        handleDOMEvents,
    }) as TextEditor;
    editor.events = new EventEmitter();
    return editor;
};
