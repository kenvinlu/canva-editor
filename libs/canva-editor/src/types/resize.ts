export type CornerDirection = 'topRight' | 'bottomRight' | 'bottomLeft' | 'topLeft';
export type EdgeDirection = 'top' | 'right' | 'bottom' | 'left';
export type Direction = EdgeDirection | CornerDirection;

export type ResizeCallback = (e: MouseEvent | TouchEvent, direction: Direction) => void;
