/* eslint-disable no-magic-numbers */

import type {TData, TCommand} from './types'

const ERROR_MAX_STRING_LENGTH = 15
const error = (msg: string, string: string, i: number) => {
    const textBefore = string.substr(0, i)
    const char = string.charAt(i)
    const textAfter = (string.length - i) > ERROR_MAX_STRING_LENGTH
        ? string.substr(i + 1, ERROR_MAX_STRING_LENGTH) + '...'
        : string.substr(i + 1)
    return Error(`${msg}; context (${i}): ${textBefore}[${char}]${textAfter} `)
}

const makeNumber = (numberString: string, string: string, i: number): number => {
    //todo: check format
    const result = Number(numberString)
    if (Number.isNaN(result)) {
        throw error(`Bad number format: "${numberString}"`, string, i)
    }
    return result
}

const parseArguments = (string: string, i: number): [number[], number] => {
    const result = []
    let nextI = i
    let number = ''
    while (nextI < string.length) {
        const char = string[nextI]
        //todo: parse \n too
        if (/\s/.test(char) || char === ',') {
            if (number !== '') {
                result.push(makeNumber(number, string, nextI))
                number = ''
            }
        }
        // todo: ged rid of regexp
        else if (/\d/.test(char)) {
            number += char
        }
        else if (char === '-') {
            if (number === '-') {
                throw error('Minus symbol in an unexpected place', string, nextI)
            }
            else if (number !== '') {
                result.push(makeNumber(number, string, nextI))
                number = '-'
            }
            else {
                number += char
            }
        }
        else if (char === '.') {
            number += char
        }
        else {
            break
        }
        nextI++
    }
    if (number !== '') {
        result.push(makeNumber(number, string, nextI))
    }
    return [result, nextI]
}


const parseArgumentsGeneral = (string: string, i: number, perCommand: number): [number[][], number] => {
    const [args, nextI] = parseArguments(string, i)

    if (perCommand === 0) {
        if (args.length !== 0) {
            throw error(`Wrong parameters count (${args.length}), should be ${perCommand} per command`, string, i)
        }
    }
    else {
        if (args.length === 0) {
            throw error(`Wrong parameters count (${args.length}), should be ${perCommand} per command`, string, i)
        }
        if (args.length % perCommand !== 0) {
            throw error(`Wrong parameters count (${args.length}), should be ${perCommand} per command`, string, i)
        }
    }

    const argGroups: number[][] = []
    for (let i = 0; i < args.length; i += perCommand) {
        const group = []
        for (let j = 0; j < perCommand; j++) {
            group.push(args[i + j])
        }
        argGroups.push(group)
    }
    return [argGroups, nextI]
}


const parseMove = (string: string, i: number, relative = false): [TCommand[], number] => {
    const [argGroups, nextI] = parseArgumentsGeneral(string, i, 2)
    const commands: TCommand[] = []
    for (let i = 0; i < argGroups.length; ++i) {
        if (relative) {
            commands.push({c: 'm', dx: argGroups[i][0], dy: argGroups[i][1]})
        }
        else {
            commands.push({c: 'M', x: argGroups[i][0], y: argGroups[i][1]})
        }
    }
    return [commands, nextI]
}

const parseClose = (string: string, i: number, relative = false): [TCommand[], number] => {
    const [_, nextI] = parseArgumentsGeneral(string, i, 0)
    return [[relative ? {c: 'z'} : {c: 'Z'}], nextI]
}

const parseLine = (string: string, i: number, relative = false): [TCommand[], number] => {
    const [argGroups, nextI] = parseArgumentsGeneral(string, i, 2)
    const commands: TCommand[] = []
    for (let i = 0; i < argGroups.length; ++i) {
        if (relative) {
            commands.push({c: 'l', dx: argGroups[i][0], dy: argGroups[i][1]})
        }
        else {
            commands.push({c: 'L', x: argGroups[i][0], y: argGroups[i][1]})
        }
    }
    return [commands, nextI]
}

const parseHorizontal = (string: string, i: number, relative = false): [TCommand[], number] => {
    const [argGroups, nextI] = parseArgumentsGeneral(string, i, 1)
    const commands: TCommand[] = []
    for (let i = 0; i < argGroups.length; ++i) {
        if (relative) {
            commands.push({c: 'h', dx: argGroups[i][0]})
        }
        else {
            commands.push({c: 'H', x: argGroups[i][0]})
        }
    }
    return [commands, nextI]
}

const parseVertical = (string: string, i: number, relative = false): [TCommand[], number] => {
    const [argGroups, nextI] = parseArgumentsGeneral(string, i, 1)
    const commands: TCommand[] = []
    for (let i = 0; i < argGroups.length; ++i) {
        if (relative) {
            commands.push({c: 'v', dy: argGroups[i][0]})
        }
        else {
            commands.push({c: 'V', y: argGroups[i][0]})
        }
    }
    return [commands, nextI]
}

const parseCurve = (string: string, i: number, relative = false): [TCommand[], number] => {
    const [argGroups, nextI] = parseArgumentsGeneral(string, i, 6)
    const commands: TCommand[] = []
    for (let i = 0; i < argGroups.length; ++i) {
        if (relative) {
            commands.push({
                c: 'c',
                dx1: argGroups[i][0],
                dy1: argGroups[i][1],
                dx2: argGroups[i][2],
                dy2: argGroups[i][3],
                dx: argGroups[i][4],
                dy: argGroups[i][5],
            })
        }
        else {
            commands.push({
                c: 'C',
                x1: argGroups[i][0],
                y1: argGroups[i][1],
                x2: argGroups[i][2],
                y2: argGroups[i][3],
                x: argGroups[i][4],
                y: argGroups[i][5],
            })
        }
    }
    return [commands, nextI]
}

const parseShortCurve = (string: string, i: number, relative = false): [TCommand[], number] => {
    const [argGroups, nextI] = parseArgumentsGeneral(string, i, 4)
    const commands: TCommand[] = []
    for (let i = 0; i < argGroups.length; ++i) {
        if (relative) {
            commands.push({
                c: 's',
                dx2: argGroups[i][0],
                dy2: argGroups[i][1],
                dx: argGroups[i][2],
                dy: argGroups[i][3],
            })
        }
        else {
            commands.push({
                c: 'S',
                x2: argGroups[i][0],
                y2: argGroups[i][1],
                x: argGroups[i][2],
                y: argGroups[i][3],
            })
        }
    }
    return [commands, nextI]
}

const parseQuadCurve = (string: string, i: number, relative = false): [TCommand[], number] => {
    const [argGroups, nextI] = parseArgumentsGeneral(string, i, 4)
    const commands: TCommand[] = []
    for (let i = 0; i < argGroups.length; ++i) {
        if (relative) {
            commands.push({
                c: 'q',
                dx1: argGroups[i][0],
                dy1: argGroups[i][1],
                dx: argGroups[i][2],
                dy: argGroups[i][3],
            })
        }
        else {
            commands.push({
                c: 'Q',
                x1: argGroups[i][0],
                y1: argGroups[i][1],
                x: argGroups[i][2],
                y: argGroups[i][3],
            })
        }
    }
    return [commands, nextI]
}

const parseShortQuadCurve = (string: string, i: number, relative = false): [TCommand[], number] => {
    const [argGroups, nextI] = parseArgumentsGeneral(string, i, 2)
    const commands: TCommand[] = []
    for (let i = 0; i < argGroups.length; ++i) {
        if (relative) {
            commands.push({
                c: 't',
                dx: argGroups[i][0],
                dy: argGroups[i][1],
            })
        }
        else {
            commands.push({
                c: 'T',
                x: argGroups[i][0],
                y: argGroups[i][1],
            })
        }
    }
    return [commands, nextI]
}

const parseArc = (string: string, i: number, relative = false): [TCommand[], number] => {
    const [argGroups, nextI] = parseArgumentsGeneral(string, i, 7)
    const commands: TCommand[] = []
    for (let i = 0; i < argGroups.length; ++i) {
        if (relative) {
            commands.push({
                c: 'a',
                rx: argGroups[i][0],
                ry: argGroups[i][1],
                xAxisRotation: argGroups[i][2],
                largeArcFlag: argGroups[i][3],
                sweepFlag: argGroups[i][4],
                dx: argGroups[i][5],
                dy: argGroups[i][6],
            })
        }
        else {
            commands.push({
                c: 'A',
                rx: argGroups[i][0],
                ry: argGroups[i][1],
                xAxisRotation: argGroups[i][2],
                largeArcFlag: argGroups[i][3],
                sweepFlag: argGroups[i][4],
                x: argGroups[i][5],
                y: argGroups[i][6],
            })
        }
    }
    return [commands, nextI]
}

export const parseNextCommand = (string: string, i: number) => {
    const ch = string[i]
    const commandStartI = i + 1
    switch (ch) {
        case 'M': return parseMove(string, commandStartI)
        case 'm': return parseMove(string, commandStartI, true)
        case 'Z': return parseClose(string, commandStartI)
        case 'z': return parseClose(string, commandStartI, true)
        case 'L': return parseLine(string, commandStartI)
        case 'l': return parseLine(string, commandStartI, true)
        case 'H': return parseHorizontal(string, commandStartI)
        case 'h': return parseHorizontal(string, commandStartI, true)
        case 'V': return parseVertical(string, commandStartI)
        case 'v': return parseVertical(string, commandStartI, true)
        case 'C': return parseCurve(string, commandStartI)
        case 'c': return parseCurve(string, commandStartI, true)
        case 'S': return parseShortCurve(string, commandStartI)
        case 's': return parseShortCurve(string, commandStartI, true)
        case 'Q': return parseQuadCurve(string, commandStartI)
        case 'q': return parseQuadCurve(string, commandStartI, true)
        case 'T': return parseShortQuadCurve(string, commandStartI)
        case 't': return parseShortQuadCurve(string, commandStartI, true)
        case 'A': return parseArc(string, commandStartI)
        case 'a': return parseArc(string, commandStartI, true)
        default: throw error(`Unknown c: ${ch}`, string, i)
    }
}

export const parse = (string: string): TData => {
    const result = []
    let i = 0
    while (i < string.length) {
        const [commands, nextI] = parseNextCommand(string, i)
        result.push(...commands)
        i = nextI
    }
    return result
}
