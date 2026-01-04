import { FC, Fragment } from 'react';
import { css, Global } from '@emotion/react';
import FontStyle from './FontStyle';
import { FontData } from 'canva-editor/types';

export interface GlobalStyleProps {
  fonts: FontData[];
  mode?: 'editor' | 'view';
}

export const GlobalStyle: FC<GlobalStyleProps> = ({ fonts, mode = 'view' }) => {
  const formatText = `
        .canva-editor-text {
            counter-reset: list;
            p {
                margin-left: calc(var(--indent-level)*1.7em);

            }
            p:before {
                counter-increment: list;
                content: counter(list, var(--counter-list-marker)) ".";
                left: 0;
                padding-right: 0.1em;
                height: calc(var(--line-height))*1em;
                width: calc(var(--indent-level)*1em);
                position: absolute;
                margin: 0;
                padding: 0;
                white-space: nowrap;
            }
        }
    `;

  const commonCss = `
        * {
            -webkit-user-select: ${
              mode === 'editor' ? 'none' : 'text'
            }; /* Safari */
            -khtml-user-select: ${
              mode === 'editor' ? 'none' : 'text'
            }; /* Konqueror HTML */
            -moz-user-select: ${
              mode === 'editor' ? 'none' : 'text'
            }; /* Old versions of Firefox */
            -ms-user-select: ${
              mode === 'editor' ? 'none' : 'text'
            }; /* Internet Explorer/Edge */
            user-select: ${mode === 'editor' ? 'none' : 'text'};
            -webkit-user-drag: none;
             -webkit-touch-callout: none; /* iOS Safari */
        }
        @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
          
          @-moz-keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
          
          @-webkit-keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
          
          @-o-keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
          
          @-ms-keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
    `;
  return (
    <Fragment>
      <Global
        styles={css`
          ${formatText}
          ${commonCss}
        `}
      />
      {fonts.map((font) => (
        <FontStyle key={font.name} font={font} />
      ))}
    </Fragment>
  );
};
