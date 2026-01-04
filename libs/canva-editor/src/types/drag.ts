import { Delta } from ".";

export type DragCallback = (e: MouseEvent | TouchEvent, position: Delta) => void;
