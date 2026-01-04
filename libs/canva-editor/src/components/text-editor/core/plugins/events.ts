// https://prosemirror.net/docs/ref/#state.PluginView
import { Plugin } from 'prosemirror-state';
import { TextEditor } from '../../interfaces';
const events = () =>
    new Plugin({
        view() {
            return {
                update: function (view, prevState) {
                    const state = view.state;
                    
                    // No change in the document or selection
                    if (prevState && prevState.doc.eq(state.doc) && prevState.selection.eq(state.selection)) return;
                    
                    // Document or selection has changed
                    // Perform actions based on the changes
                    if (prevState && !prevState.doc.eq(state.doc)) {
                        // const scrollTop = editorView.dom.scrollTop;
                        (view as unknown as TextEditor).events.emit('update', view);
                        // editorView.dom.scrollTop = scrollTop;
                        return;
                    }
                    // Additional logic when the selection changes
                    (view as unknown as TextEditor).events.emit('selectionUpdate', view);
                },
            };
        },
    });

export default events;
