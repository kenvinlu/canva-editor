import { isMacOs } from 'react-device-detect';

export const normalizeKeyName = (name: string) => {
    const parts = name.split(/-(?!$)/);
    let result = parts[parts.length - 1];
    if (result == 'Space') result = ' ';
    let alt, ctrl, shift, meta;
    for (let i = 0; i < parts.length - 1; i++) {
        const mod = parts[i];
        if (/^(cmd|meta|m)$/i.test(mod)) meta = true;
        else if (/^a(lt)?$/i.test(mod)) alt = true;
        else if (/^(c|ctrl|control)$/i.test(mod)) ctrl = true;
        else if (/^s(hift)?$/i.test(mod)) shift = true;
        else if (/^mod$/i.test(mod)) {
            if (isMacOs) meta = true;
            else ctrl = true;
        } else throw new Error('Unrecognized modifier name: ' + mod);
    }
    if (alt) result = 'Alt-' + result;
    if (ctrl) result = 'Ctrl-' + result;
    if (meta) result = 'Meta-' + result;
    if (shift) result = 'Shift-' + result;
    return result;
};

export const modifiers = (name: string, event: KeyboardEvent, shift = true) => {
    if (event.altKey) name = 'Alt-' + name;
    if (event.ctrlKey) name = 'Ctrl-' + name;
    if (event.metaKey) name = 'Meta-' + name;
    if (shift && event.shiftKey) name = 'Shift-' + name;
    return name;
};
