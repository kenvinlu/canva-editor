import { setBlockType, chainCommands, exitCode, joinUp, joinDown, lift, selectParentNode } from 'prosemirror-commands';
import { undo, redo } from 'prosemirror-history';
import { undoInputRule } from 'prosemirror-inputrules';
import { Command } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { toggleBold } from '../command/bold';
import { toggleItalic } from '../command/italic';
import { isMacOs } from 'react-device-detect';
import { splitBlockKeepMarks } from '../command/splitBlockKeepMarks';
import { selectAll } from '../command/selectAll';

/// Inspect the given schema looking for marks and nodes from the
/// basic schema, and if found, add key bindings related to them.
/// This will add:
///
/// * **Mod-b** for toggling [strong](#schema-basic.StrongMark)
/// * **Mod-i** for toggling [emphasis](#schema-basic.EmMark)
/// * **Mod-`** for toggling [code font](#schema-basic.CodeMark)
/// * **Ctrl-Shift-0** for making the current textblock a paragraph
/// * **Ctrl-Shift-1** to **Ctrl-Shift-Digit6** for making the current
///   textblock a heading of the corresponding level
/// * **Ctrl-Shift-Backslash** to make the current textblock a code block
/// * **Ctrl-Shift-8** to wrap the selection in an ordered list
/// * **Ctrl-Shift-9** to wrap the selection in a bullet list
/// * **Ctrl->** to wrap the selection in a block quote
/// * **Enter** to split a non-empty textblock in a list item while at
///   the same time splitting the list item
/// * **Mod-Enter** to insert a hard break
/// * **Mod-_** to insert a horizontal rule
/// * **Backspace** to undo an input rule
/// * **Alt-ArrowUp** to `joinUp`
/// * **Alt-ArrowDown** to `joinDown`
/// * **Mod-BracketLeft** to `lift`
/// * **Escape** to `selectParentNode`
///
/// You can suppress or map these bindings by passing a `mapKeys`
/// argument, which maps key names (say `"Mod-B"` to either `false`, to
/// remove the binding, or a new key name string.
export function buildKeyMap(schema: Schema, mapKeys?: { [key: string]: false | string }) {
    const keys: { [key: string]: Command } = {};
    let type;
    function bind(key: string, cmd: Command) {
        if (mapKeys) {
            const mapped = mapKeys[key];
            if (mapped === false) return;
            if (mapped) key = mapped;
        }
        keys[key] = cmd;
    }

    bind('Mod-z', undo);
    bind('Mod-y', redo);
    bind('Mod-a', selectAll);
    bind('Backspace', undoInputRule);

    bind('Alt-ArrowUp', joinUp);
    bind('Alt-ArrowDown', joinDown);
    bind('Mod-BracketLeft', lift);
    bind('Escape', selectParentNode);

    if ((type = schema.marks.bold)) {
        bind('Mod-b', toggleBold);
        bind('Mod-B', toggleBold);
    }
    if ((type = schema.marks.italic)) {
        bind('Mod-i', toggleItalic);
        bind('Mod-I', toggleItalic);
    }
    bind('Enter', splitBlockKeepMarks);
    if ((type = schema.nodes.hard_break)) {
        const br = type,
            cmd = chainCommands(exitCode, (state, dispatch) => {
                if (dispatch) dispatch(state.tr.replaceSelectionWith(br.create()).scrollIntoView());
                return true;
            });
        bind('Mod-Enter', cmd);
        bind('Shift-Enter', cmd);
        if (isMacOs) bind('Ctrl-Enter', cmd);
    }
    if ((type = schema.nodes.paragraph)) bind('Shift-Ctrl-0', setBlockType(type));

    return keys;
}
