import { css, Global } from '@emotion/react';
import React, { FC, useMemo } from 'react';
import { FontData } from '../../types';
import { handleFontStyle } from 'canva-editor/utils/fontHelper';

export interface FontStyleProps {
    font: FontData;
}

const FontStyle: FC<FontStyleProps> = ({ font }) => {
    const fontFaceString = useMemo(() => {
        const fontFaceCss: string[] = [];
        fontFaceCss.push(`
            @font-face {
                font-family: '${font.name}';
                ${handleFontStyle(font.style)}
                src: url(${font.url}) format('woff2');
                font-display: block;
            }
        `);
        return fontFaceCss.join('\n');
    }, [font]);

    return (
        <Global
            styles={css`
                ${fontFaceString}
            `}
        />
    );
};

export default React.memo(FontStyle);
