import React, { FC, Fragment, PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';
import { ColorPicker, ColorIcon } from 'canva-editor/color-picker';
import Popover from 'canva-editor/components/popover/Popover';
import { getGradientBackground } from 'canva-editor/layers';
import { ColorParser } from 'canva-editor/color-picker/utils';
import ArrowLeftIcon from 'canva-editor/icons/ArrowLeftIcon';
import PlusIcon from 'canva-editor/icons/PlusIcon';

type GradientStyle = 'leftToRight' | 'topToBottom' | 'topLeftToBottomRight' | 'circleCenter' | 'circleTopLeft';
interface GradientPickerProps {
    selectedColor: string;
    event: 'click' | 'doubleClick';
    gradient?: { colors: string[]; style: GradientStyle } | null;
    onChangeGradient: (gradient: { colors: string[]; style: GradientStyle }) => void;
    onChangeColor: (color: string) => void;
}

const GRADIENT_STYLE: GradientStyle[] = [
    'leftToRight',
    'topToBottom',
    'topLeftToBottomRight',
    'circleCenter',
    'circleTopLeft',
];
const GradientPicker: FC<PropsWithChildren<GradientPickerProps>> = ({
    selectedColor,
    gradient,
    event,
    children,
    onChangeGradient,
    onChangeColor,
}) => {
    const mainRef = useRef<HTMLDivElement>(null);
    const gradientRef = useRef<HTMLDivElement>(null);
    const colorRef = useRef<HTMLButtonElement[]>([]);
    const [openGradientPicker, setOpenGradientPicker] = useState(false);
    const [editColorPicker, setEditColorPicker] = useState<{ index: number; color: string } | null>(null);
    const [tab, setTab] = useState(gradient ? 'gradient' : 'solid');
    const [tmpGradient, setTmpGradient] = useState<{ colors: string[]; style: GradientStyle }>();
    const [tmpColor, setTmpColor] = useState<string>(selectedColor);
    const gradientColors = useMemo(() => {
        if (gradient?.colors.length) {
            return gradient?.colors;
        } else {
            const c = new ColorParser(selectedColor);
            const hsl = c.toHsl();
            if (hsl.l < 50) {
                hsl.l = Math.min(100, hsl.l + 30);
            } else {
                hsl.l = Math.max(0, hsl.l - 30);
            }
            return [c.toRgbString(), new ColorParser(hsl).toRgbString()];
        }
    }, [gradient, selectedColor]);
    useEffect(() => {
        if (openGradientPicker) {
            setTmpGradient({ colors: gradientColors, style: gradient?.style || 'leftToRight' });
        }
    }, [openGradientPicker]);
    useEffect(() => {
        if (tmpGradient && tab === 'gradient') {
            onChangeGradient(tmpGradient);
        }
    }, [tmpGradient, tab]);
    const handleChangeSolidColor = (color: string) => {
        setTmpColor(color);
        onChangeColor(color);
    };
    const handleChangeGradientType = (style: GradientStyle) => {
        setTmpGradient({
            colors: gradientColors,
            style,
        });
    };

    const handleChangeGradientColor = (color: string) => {
        if (editColorPicker) {
            const g = [...gradientColors];
            g[editColorPicker.index] = color;
            setTmpGradient({
                colors: g,
                style: tmpGradient?.style || 'leftToRight',
            });
        }
    };

    const handleAddGradient = () => {
        const newColor = gradientColors[gradientColors.length - 1];
        setTmpGradient({
            colors: [...gradientColors, newColor],
            style: gradient?.style || 'leftToRight',
        });
        setEditColorPicker({ index: gradientColors.length, color: newColor });
    };

    const handleSwitchGradient = () => {
        setTmpGradient({
            colors: tmpGradient?.colors || [],
            style: tmpGradient?.style || 'leftToRight',
        });
    };

    const handleDeleteGradientColor = (index: number) => {
        if (tmpGradient) {
            setTmpGradient({
                colors: tmpGradient.colors.filter((_, i) => i !== index),
                style: tmpGradient.style,
            });
        }
    };

    return (
        <Fragment>
            <div
                ref={gradientRef}
                css={{ cursor: 'pointer' }}
                onClick={() => event === 'click' && setOpenGradientPicker(true)}
                onDoubleClick={() => event === 'doubleClick' && setOpenGradientPicker(true)}
            >
                {children}
            </div>
            <Popover
                ref={mainRef}
                open={openGradientPicker}
                anchorEl={gradientRef.current}
                placement={'bottom'}
                offsets={{ bottom: { y: 8, x: 0 } }}
                onClose={() => {
                    setOpenGradientPicker(false);
                    setEditColorPicker(null);
                }}
            >
                <div css={{ padding: '0 16px 16px 16px', width: 280 }}>
                    <div
                        css={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: 12,
                            borderBottom: '1px solid rgba(217, 219, 228, 0.6)',
                        }}
                    >
                        <div
                            css={{
                                display: 'inline-block',
                                cursor: 'pointer',
                                padding: 8,
                                flexGrow: 1,
                                textAlign: 'center',
                                overflow: 'hidden',
                                flexShrink: 0,
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                                color: tab === 'solid' ? '#3d8eff' : 'rgba(13,18,22,.7)',
                            }}
                            onClick={() => {
                                setTab('solid');
                                handleChangeSolidColor(selectedColor);
                            }}
                        >
                            Solid Color
                        </div>
                        <div
                            css={{
                                display: 'inline-block',
                                cursor: 'pointer',
                                padding: 8,
                                flexGrow: 1,
                                textAlign: 'center',
                                overflow: 'hidden',
                                flexShrink: 0,
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                                color: tab === 'gradient' ? '#3d8eff' : 'rgba(13,18,22,.7)',
                            }}
                            onClick={() => {
                                setTab('gradient');
                                handleSwitchGradient();
                            }}
                        >
                            Gradient
                        </div>
                    </div>
                    {tab === 'solid' && (
                        <div css={{}}>
                            <ColorPicker color={new ColorParser(tmpColor).toHex()} onChange={handleChangeSolidColor} />
                        </div>
                    )}
                    {tab === 'gradient' && (
                        <div
                            css={{
                                display: 'grid',
                                rowGap: 12,
                            }}
                        >
                            <div>
                                <div css={{ fontWeight: 700, lineHeight: 2.2 }}>Gradient colors</div>
                                <div
                                    css={{
                                        display: 'grid',
                                        gridTemplateColumns: ' repeat(auto-fill, minmax(40px, 1fr))',
                                        gridGap: 8,
                                    }}
                                >
                                    {tmpGradient?.colors.map((color, i) => (
                                        <div key={i} css={{ position: 'relative' }}>
                                            <ColorIcon
                                                ref={(el) => (colorRef.current[i] = el as HTMLButtonElement)}
                                                selected={null}
                                                color={color}
                                                onClick={() => setEditColorPicker({ index: i, color })}
                                            />
                                            <div
                                                css={{
                                                    position: 'absolute',
                                                    top: -8,
                                                    right: -8,
                                                    fontSize: 12,
                                                    padding: 4,
                                                    borderRadius: '50%',
                                                    opacity: 0,
                                                    transition: 'opacity .15s ease-in-out',
                                                    background: 'rgba(17,23,29,.6)',
                                                    color: '#fff',
                                                    display: tmpGradient?.colors.length > 2 ? 'block' : 'none',
                                                    cursor: 'pointer',
                                                    ':hover': {
                                                        opacity: 1,
                                                    },
                                                }}
                                                onClick={() =>
                                                    tmpGradient?.colors.length > 2 && handleDeleteGradientColor(i)
                                                }
                                            >
                                                <ArrowLeftIcon />
                                            </div>
                                        </div>
                                    ))}
                                    <Popover
                                        open={!!editColorPicker}
                                        anchorEl={editColorPicker && colorRef.current[editColorPicker.index]}
                                        element={mainRef.current}
                                        placement={'bottom'}
                                        offsets={{ bottom: { y: 8, x: 0 } }}
                                        onClose={() => setEditColorPicker(null)}
                                    >
                                        <div css={{ padding: 16, width: 280 }}>
                                            <ColorPicker
                                                enableAlpha={true}
                                                color={new ColorParser(editColorPicker?.color || '#f25022').toHex()}
                                                onChange={handleChangeGradientColor}
                                            />
                                        </div>
                                    </Popover>
                                    <div
                                        css={{
                                            paddingBottom: '100%',
                                            position: 'relative',
                                            width: '100%',
                                            cursor: 'pointer',
                                        }}
                                        onClick={handleAddGradient}
                                    >
                                        <div
                                            css={{
                                                background: 'rgba(64,87,109,.07)',
                                                fontSize: 24,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                position: 'absolute',
                                                inset: 0,
                                                borderRadius: 4,
                                                transition:
                                                    'background-color .1s linear,border-color .1s linear,color .1s linear',
                                                ':hover': {
                                                    background: 'rgba(57,76,96,.15)',
                                                },
                                            }}
                                        >
                                            <PlusIcon />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div css={{ fontWeight: 700, lineHeight: 2.2 }}>Style</div>
                                <div css={{ display: 'grid', columnGap: 8, gridAutoFlow: 'column' }}>
                                    {GRADIENT_STYLE.map((style) => (
                                        <div
                                            key={style}
                                            css={{ width: '100%', height: 40, borderRadius: 4, overflow: 'hidden' }}
                                            onClick={() => handleChangeGradientType(style)}
                                        >
                                            <div
                                                css={{
                                                    backgroundColor: '#fff',
                                                    backgroundPosition: '0 0, 6px 6px',
                                                    backgroundSize: '12px 12px',
                                                    width: '100%',
                                                    height: '100%',
                                                    position: 'relative',
                                                    backgroundImage:
                                                        'linear-gradient(-45deg,rgba(57,76,96,.15) 25%,transparent 25%,transparent 75%,rgba(57,76,96,.15) 75%),linear-gradient(-45deg,rgba(57,76,96,.15) 25%,transparent 25%,transparent 75%,rgba(57,76,96,.15) 75%)',
                                                }}
                                            >
                                                <div
                                                    css={{
                                                        background: getGradientBackground(gradientColors, style),
                                                        position: 'absolute',
                                                        inset: 0,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Popover>
        </Fragment>
    );
};

export default GradientPicker;
