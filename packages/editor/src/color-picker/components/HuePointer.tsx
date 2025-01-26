import { CSSObject } from "@emotion/react";

interface Props {
    style: CSSObject;
    top?: number;
    left: number;
}

export const HuePointer = ({ style, left, top = 0.5 }: Props) => {
    const addedCss = {
        top: `${top * 100}%`,
        left: `${left * 100}%`,
    };

    return (
        <div
            css={{
                position: 'absolute',
                width: 8,
                height: 8,
                transform: 'translate(-50%,-50%)',
                background: '#fff',
                borderRadius: '50%',
                boxShadow: '0 2px 5px rgba(57,76,96,.15), 0 0 0 1px rgba(64,87,109,.07)',
                zIndex: 2,
                transition: 'width height .1s',
                ...style,
            }}
            style={addedCss}
        ></div>
    );
};
