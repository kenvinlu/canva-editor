import React, { FC, useEffect, useRef } from 'react';
import { createEditor } from './core/helper/createEditor';
import { useEditor } from '../../hooks';
import { TextEditor } from './interfaces';
import { selectText } from './core/command/selectText';

interface EditorContentProps {
    editor: TextEditor;
}
const EditorContent: FC<EditorContentProps> = ({ editor }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { actions } = useEditor();
    useEffect(() => {
        actions.history.new();
        const editingEditor = createEditor({
            content: editor.dom.innerHTML,
            ele: ref.current,
            handleDOMEvents: {
                blur: () => {
                    actions.closeTextEditor();
                },
            },
        });
        selectText({ from: editingEditor.state.doc.content.size, to: editingEditor.state.doc.content.size })(
            editingEditor.state,
            editingEditor.dispatch,
        );
        editingEditor.focus();
        actions.setOpeningEditor(editingEditor);
    }, [actions]);
    return <div ref={ref} />;
};
export default React.memo(EditorContent);
