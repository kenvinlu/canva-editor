import { EditorContext } from 'canva-editor/components/editor/EditorContext';
import { EditorQuery, EditorState } from '../types';
import { useContext } from 'react';

export const useEditor = <C>(collector?: (s: EditorState, query: EditorQuery) => C) => {
    const store = useContext(EditorContext);
    const { actions, getState, query, config } = store;
    const collected = collector ? collector(store.getState(), query) : ({} as C);
    return {
        ...collected,
        actions,
        query,
        state: getState(),
        config
    };
};
