import React, { ChangeEvent, useRef, useState } from 'react';

import { Hue } from './Hue';
import { Saturation } from './Saturation';
import { ColorModel, ColorPickerBaseProps, HsvaColor } from '../types';
import { useColorManipulation } from '../useColorManipulation';
import { keyName } from 'w3c-keyname';
import Alpha from './Alpha';
import { modifiers, normalizeKeyName } from 'canva-editor/utils/keyboard';
import { ColorParser, hex2hsv, hsv2hex } from '../utils';
import ColorizeIcon from 'canva-editor/icons/ColorizeIcon';

interface Props<T extends string> extends Partial<ColorPickerBaseProps<T>> {
    colorModel: ColorModel<T>;
}

export const BaseColorPicker = ({
    colorModel,
    color = colorModel.defaultColor,
    onChange,
    enableAlpha,
    ...rest
}: Props<string>) => {
    const nodeRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [focusInput, setFocusInput] = useState(false);

    const [hsva, updateHsva] = useColorManipulation<string>(colorModel, color, onChange);
    const handleKeyDown = (e: React.KeyboardEvent) => {
        const name = keyName(e.nativeEvent);
        const key = modifiers(name, e.nativeEvent);
        if (
            !/[a-f0-9]/.test(key) &&
            !['Backspace', 'Delete', normalizeKeyName('Mod-v'), normalizeKeyName('Mod-a')].includes(key)
        ) {
            e.preventDefault();
        }
    };

    const updateValue = (hexValue: string) => {
        const value = hexValue.replace(/^#/, '');
        if (value.length >= 3) {
            updateHsva(hex2hsv(`#${value}`));
        } else if (value === '') {
            updateHsva(hex2hsv(`#ffffff`));
        } else {
            updateHsva(hex2hsv(`#${value}${value}00000`.slice(0, 7)));
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const hexValue = e.target.value.replace(/^#/, '');
        updateValue(hexValue);

        e.target.value = `#${hexValue}`;
    };
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const text = e.clipboardData.getData('text');
        const hexValue = `${text.replaceAll(/([^a-fA-F0-9])/g, '')}`.slice(0, 6);
        updateValue(hexValue);
        (e.target as HTMLInputElement).value = `#${hexValue}`;
        e.preventDefault();
    };

    const handleKeyDownAlpha = (e: React.KeyboardEvent) => {
        const name = keyName(e.nativeEvent);
        const key = modifiers(name, e.nativeEvent);
        if (
            !/[0-9]/.test(key) &&
            !['Backspace', 'Delete', normalizeKeyName('Mod-v'), normalizeKeyName('Mod-a')].includes(key)
        ) {
            e.preventDefault();
        }
    };
    const handleInputAlphaChange = (e: ChangeEvent<HTMLInputElement>) => {
        const orgValue = parseInt(e.target.value, 10) || 0;
        const v = Math.max(0, Math.min(100, orgValue));
        updateHsva({ ...hsva, a: v * 0.01 });
        e.target.value = v.toString();
    };

    const handleInputAlphaPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const text = e.clipboardData.getData('text');
        const alphaStr = text.replaceAll(/([^0-9])/g, '');
        const v = Math.max(0, Math.min(100, parseInt(alphaStr, 10)));
        (e.target as HTMLInputElement).value = v.toString();
        updateHsva({ ...hsva, a: v * 0.01 });
        e.preventDefault();
    };

    const handleSelectColor = (c: Partial<HsvaColor>) => {
        (inputRef.current as HTMLInputElement).value = hsv2hex({ ...hsva, ...c }).slice(0, 7);
        updateHsva(c);
    };

    const handleEyedropper = async () => {
        if (window.EyeDropper) {
            const eyeDropper = new window.EyeDropper();
            const result = await eyeDropper.open();
            (inputRef.current as HTMLInputElement).value = new ColorParser(result.sRGBHex).toHex();
            updateValue(new ColorParser(result.sRGBHex).toHex());
        }
    };
    return (
        <div {...rest} ref={nodeRef} css={{ position: 'relative', width: '100%', display: 'grid', rowGap: 8 }}>
            <Saturation hsva={hsva} onChange={handleSelectColor} />
            <Hue hue={hsva.h} onChange={handleSelectColor} />
            {enableAlpha && <Alpha hsva={hsva} onChange={handleSelectColor} />}
            <div css={{ display: 'flex' }}>
                <div
                    css={{
                        flexGrow: 1,
                        borderWidth: 1,
                        borderRadius: 4,
                        fontSize: 14,
                        lineHeight: '36px',
                        color: 'rgb(94, 98, 120)',
                        marginRight: 8,
                        display: 'flex',
                        overflow: 'hidden',
                        borderColor: focusInput ? '#3d8eff' : 'rgb(217, 219, 228)',
                    }}
                >
                    <div css={{ flexGrow: 1 }}>
                        <input
                            ref={inputRef}
                            type={'text'}
                            defaultValue={color}
                            css={{
                                width: '100%',
                                height: '100%',
                                textAlign: enableAlpha ? 'left' : 'center',
                                textTransform: 'uppercase',
                                padding: '0 12px',
                            }}
                            onKeyDown={handleKeyDown}
                            onChange={handleInputChange}
                            onFocus={(e) => {
                                e.target.select();
                                setFocusInput(true);
                            }}
                            onBlur={() => setFocusInput(false)}
                            onPaste={handlePaste}
                            maxLength={7}
                        />
                    </div>
                    {enableAlpha && (
                        <div css={{ display: 'flex', alignItems: 'center', flexShrink: 0, width: 80, paddingLeft: 12 }}>
                            <input
                                type={'text'}
                                onKeyDown={handleKeyDownAlpha}
                                onChange={handleInputAlphaChange}
                                onFocus={(e) => {
                                    e.target.select();
                                }}
                                onPaste={handleInputAlphaPaste}
                                defaultValue={Math.round(hsva.a * 100)}
                                css={{ width: '100%', height: '100%', textAlign: 'right', padding: '0 8px' }}
                            />
                            <span css={{ color: 'rgba(13,18,22,.7)', padding: '0 8px', flexShrink: 0 }}>%</span>
                        </div>
                    )}
                </div>
                <div css={{}}>
                    <div
                        css={{
                            width: 38,
                            height: 38,
                            border: '1px solid rgb(217, 219, 228)',
                            background: window.EyeDropper ? undefined : color,
                            borderRadius: 4,
                            fontSize: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: window.EyeDropper ? 'pointer' : undefined,
                        }}
                        onClick={handleEyedropper}
                    >
                        {window.EyeDropper && <ColorizeIcon />}
                    </div>
                </div>
            </div>
        </div>
    );
};
