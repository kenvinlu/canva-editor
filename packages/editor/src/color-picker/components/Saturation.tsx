import React from 'react';
import { Interactive, Interaction } from './Interactive';
import { Pointer } from './Pointer';
import { HsvaColor } from '../types';
import { clamp } from '../utils/clamp';
import { hsv2hslString } from '../utils';

interface Props {
    hsva: HsvaColor;
    onChange: (newColor: { s: number; v: number }) => void;
}

const SaturationBase = ({ hsva, onChange }: Props) => {
    const handleMove = (interaction: Interaction) => {
        onChange({
            s: interaction.left * 100,
            v: 100 - interaction.top * 100,
        });
    };

    const handleKey = (offset: Interaction) => {
        // Saturation and brightness always fit into [0, 100] range
        onChange({
            s: clamp(hsva.s + offset.left * 100, 0, 100),
            v: clamp(hsva.v - offset.top * 100, 0, 100),
        });
    };

    const containerStyle = {
        backgroundColor: hsv2hslString({ h: hsva.h, s: 100, v: 100, a: 1 }),
    };

    return (
        <div
            css={{
                position: 'relative',
                flexGrow: 1,
                borderColor: 'transparent',
                borderRadius: 4,
                height: 112,
                backgroundImage:
                    'linear-gradient(to top, #000, rgba(0, 0, 0, 0)), linear-gradient(to right, #fff, rgba(255, 255, 255, 0))',
                cursor: 'pointer',
            }}
            style={containerStyle}
        >
            <Interactive
                onMove={handleMove}
                onKey={handleKey}
                aria-label="Color"
                aria-valuetext={`Saturation ${Math.round(hsva.s)}%, Brightness ${Math.round(hsva.v)}%`}
            >
                <Pointer zIndex={3} top={1 - hsva.v / 100} left={hsva.s / 100} color={hsv2hslString(hsva)} />
            </Interactive>
        </div>
    );
};

export const Saturation = React.memo(SaturationBase);
