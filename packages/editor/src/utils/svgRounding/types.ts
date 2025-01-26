// @flow
export type TPoint = {x: number, y: number}

export type TAbsoluteCommand =
    | { c: 'M', x: number, y: number }
    | { c: 'Z'}
    | { c: 'L', x: number, y: number}
    | { c: 'C', x1: number, y1: number, x2: number, y2: number, x: number, y: number}
    | { c: 'S', x2: number, y2: number, x: number, y: number}
    | { c: 'Q', x1: number, y1: number, x: number, y: number}
    | { c: 'T', x: number, y: number}
    | { c: 'A', rx: number, ry: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number, x: number, y: number}

export type TRelativeCommand =
    | { c: 'm', dx: number, dy: number}
    | { c: 'z'}
    | { c: 'l', dx: number, dy: number}
    | { c: 'H', x: number}
    | { c: 'V', y: number}
    | { c: 'h', dx: number}
    | { c: 'v', dy: number}
    | { c: 'c', dx1: number, dy1: number, dx2: number, dy2: number, dx: number, dy: number}
    | { c: 's', dx2: number, dy2: number, dx: number, dy: number}
    | { c: 'q', dx1: number, dy1: number, dx: number, dy: number}
    | { c: 't', dx: number, dy: number}
    | { c: 'a', rx: number, ry: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number, dx: number, dy: number}

export type TCommand = TAbsoluteCommand | TRelativeCommand

export type TAbsoluteData = ReadonlyArray<TAbsoluteCommand>
export type TRelativeData = ReadonlyArray<TRelativeCommand>
export type TData = ReadonlyArray<TCommand>

export type TSubPath = TAbsoluteData
