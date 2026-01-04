import { EditorState } from 'canva-editor/types/editor';
import { applyPatches, Patch } from 'immer';

type Timeline = {
    patches: Patch[];
    inversePatches: Patch[];
    timestamp: number;
}[];

export const HISTORY_ACTIONS = {
    UNDO: 'HISTORY_UNDO',
    REDO: 'HISTORY_REDO',
    THROTTLE: 'HISTORY_THROTTLE',
    IGNORE: 'HISTORY_IGNORE',
    MERGE: 'HISTORY_MERGE',
    CLEAR: 'HISTORY_CLEAR',
    NEW: 'HISTORY_NEW',
    BACK: 'HISTORY_BACK',
};
export class History {
    timeline: Timeline = [];
    pointer = -1;

    add(patches: Patch[], inversePatches: Patch[]) {
        this.pointer = this.pointer + 1;
        this.timeline.length = this.pointer;
        this.timeline[this.pointer] = {
            patches,
            inversePatches,
            timestamp: Date.now(),
        };
    }
    throttleAdd(patches: Patch[], inversePatches: Patch[], throttleRate = 500) {
        if (this.timeline.length && this.pointer >= 0) {
            const { patches: currPatches, inversePatches: currInversePatches, timestamp } = this.timeline[this.pointer];
            const now = new Date();
            const diff = now.getTime() - timestamp;

            if (diff < throttleRate) {
                this.timeline[this.pointer] = {
                    timestamp,
                    patches: [...currPatches, ...patches],
                    inversePatches: [...inversePatches, ...currInversePatches],
                };
                return;
            }
        }

        this.add(patches, inversePatches);
    }
    back() {
        if (!this.canUndo()) {
            return;
        }
        this.timeline.splice(this.pointer, 1);
        this.pointer = this.pointer - 1;
    }

    merge(patches: Patch[], inversePatches: Patch[]) {
        if (patches.length === 0 && inversePatches.length === 0) {
            return;
        }

        if (this.timeline.length && this.pointer >= 0) {
            const { patches: currPatches, inversePatches: currInversePatches, timestamp } = this.timeline[this.pointer];

            this.timeline[this.pointer] = {
                timestamp,
                patches: [...currPatches, ...patches],
                inversePatches: [...inversePatches, ...currInversePatches],
            };
            return;
        }

        this.add(patches, inversePatches);
    }

    clear() {
        this.timeline = [];
        this.pointer = -1;
    }

    canUndo() {
        return this.pointer >= 0;
    }

    canRedo() {
        return this.pointer < this.timeline.length - 1;
    }

    undo(state: EditorState) {
        if (!this.canUndo()) {
            return;
        }
        const { inversePatches } = this.timeline[this.pointer];
        this.pointer = this.pointer - 1;
        const patches = inversePatches.filter((patch) => {
            return patch.path[0] !== 'textEditor'; // TextEditor doesn't work with history
        });
        return applyPatches(state, patches);
    }

    redo(state: EditorState) {
        if (!this.canRedo()) {
            return;
        }

        this.pointer = this.pointer + 1;
        const { patches } = this.timeline[this.pointer];
        const p = patches.filter((patch) => {
            return patch.path[0] !== 'textEditor'; // TextEditor doesn't work with history
        });
        return applyPatches(state, p);
    }
}
