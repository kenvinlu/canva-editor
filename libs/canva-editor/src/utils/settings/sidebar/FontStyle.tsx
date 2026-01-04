import React, { useMemo } from 'react';
import { css, Global } from '@emotion/react';
import { useEditor } from 'canva-editor/hooks';

const FontStyle = () => {
  const { fontList } = useEditor((state) => ({ fontList: state.fontList }));
  const fontFaceString = useMemo(() => {
    const fontFaceCss: string[] = [];
    fontList.forEach((font) => {
      fontFaceCss.push(`
                    @font-face {
                      font-family: '${font.name}';
                      src: url(${font.url}) format('woff2');
                      font-display: block;
                    }
                `);
    });
    return fontFaceCss.join('\n');
  }, [fontList]);
  return (
    <Global
      styles={css`
        ${fontFaceString}
      `}
    />
  );
};

export default React.memo(FontStyle);
