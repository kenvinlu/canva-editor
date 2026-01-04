import React, { useState } from 'react';

import { Interactive, Interaction } from './Interactive';
import { HuePointer } from './HuePointer';
import { clamp } from '../utils/clamp';

interface Props {
    hue: number;
    onChange: (newHue: { h: number }) => void;
}

const HueBase = ({ hue, onChange }: Props) => {
    const [isMoving, setIsMoving] = useState(false);
    const handleMoveStart = () => {
        setIsMoving(true);
    };
    const handleMoveEnd = () => {
        setIsMoving(false);
    };
    const handleMove = (interaction: Interaction) => {
        onChange({ h: 360 * interaction.left });
    };

    const handleKey = (offset: Interaction) => {
        // Hue measured in degrees of the color circle ranging from 0 to 360
        onChange({
            h: clamp(hue + offset.left * 360, 0, 360),
        });
    };

    return (
        <div
            css={{
                borderRadius: 6,
                position: 'relative',
                height: 12,
                background: 'linear-gradient(90deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red)',
                cursor: 'pointer',
            }}
        >
            <Interactive
                onMoveStart={handleMoveStart}
                onMoveEnd={handleMoveEnd}
                onMove={handleMove}
                onKey={handleKey}
                aria-label="Hue"
                aria-valuenow={Math.round(hue)}
                aria-valuemax="360"
                aria-valuemin="0"
            >
                <HuePointer
                    style={{
                        width: isMoving ? 12 : 8,
                        height: isMoving ? 12 : 8,
                        ':hover': {
                            width: 12,
                            height: 12,
                        },
                    }}
                    left={hue / 360}
                />
            </Interactive>
        </div>
    );
};

export const Hue = React.memo(HueBase);
