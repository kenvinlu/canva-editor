import { base, keyName } from 'w3c-keyname';
import { Plugin, Command } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { modifiers, normalizeKeyName } from 'canva-editor/utils';

function normalize(map: { [key: string]: Command }) {
    const copy: { [key: string]: Command } = Object.create(null);
    for (const prop in map) copy[normalizeKeyName(prop)] = map[prop];
    return copy;
}

/// Create a keymap plugin for the given set of bindings.
///
/// Bindings should map key names to [command](#commands)-style
/// functions, which will be called with `(EditorState, dispatch,
/// EditorView)` arguments, and should return true when they've handled
/// the key. Note that the view argument isn't part of the command
/// protocol, but can be used as an escape hatch if a binding needs to
/// directly interact with the UI.
///
/// Key names may be strings like `"Shift-Ctrl-Enter"`—a key
/// identifier prefixed with zero or more modifiers. Key identifiers
/// are based on the strings that can appear in
/// [`KeyEvent.key`](https:///developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key).
/// Use lowercase letters to refer to letter keys (or uppercase letters
/// if you want shift to be held). You may use `"Space"` as an alias
/// for the `" "` name.
///
/// Modifiers can be given in any order. `Shift-` (or `s-`), `Alt-` (or
/// `a-`), `Ctrl-` (or `c-` or `Control-`) and `Cmd-` (or `m-` or
/// `Meta-`) are recognized. For characters that are created by holding
/// shift, the `Shift-` prefix is implied, and should not be added
/// explicitly.
///
/// You can use `Mod-` as a shorthand for `Cmd-` on Mac and `Ctrl-` on
/// other platforms.
///
/// You can add multiple keymap plugins to an editor. The order in
/// which they appear determines their precedence (the ones early in
/// the array get to dispatch first).
export function keymap(bindings: { [key: string]: Command }): Plugin {
    return new Plugin({ props: { handleKeyDown: keydownHandler(bindings) } });
}

/// Given a set of bindings (using the same format as
/// [`keymap`](#keymap.keymap)), return a [keydown
/// handler](#view.EditorProps.handleKeyDown) that handles them.
export function keydownHandler(bindings: {
    [key: string]: Command;
}): (view: EditorView, event: KeyboardEvent) => boolean {
    const map = normalize(bindings);
    return function (view, event) {
        event.stopPropagation();
        const name = keyName(event);
        const direct = map[modifiers(name, event)];
        let baseName;
        if (direct && direct(view.state, view.dispatch, view)) return true;
        // A character key
        if (name.length == 1 && name != ' ') {
            if (event.shiftKey) {
                // In case the name was already modified by shift, try looking
                // it up without its shift modifier
                const noShift = map[modifiers(name, event, false)];
                if (noShift && noShift(view.state, view.dispatch, view)) return true;
            }
            if (
                (event.shiftKey || event.altKey || event.metaKey || name.charCodeAt(0) > 127) &&
                (baseName = base[event.keyCode]) &&
                baseName != name
            ) {
                // Try falling back to the keyCode when there's a modifier
                // active or the character produced isn't ASCII, and our table
                // produces a different name from the the keyCode. See #668,
                // #1060
                const fromCode = map[modifiers(baseName, event)];
                if (fromCode && fromCode(view.state, view.dispatch, view)) return true;
            }
        }
        return false;
    };
}
