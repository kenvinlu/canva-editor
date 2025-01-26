import { FC, useEffect } from 'react';
import { EffectSettings, FontData, LayerComponentProps } from '../../types';
import { getTextEffectStyle } from '../text/textEffect';

export interface TextContentProps extends LayerComponentProps {
  id: string;
  text: string;
  scale: number;
  fonts: FontData[];
  colors: string[];
  fontSizes: number[];
  effect: {
    name: string;
    settings: EffectSettings;
  } | null;
}

export const TextContent: FC<TextContentProps> = ({
  id,
  text,
  colors,
  fontSizes,
  effect,
}) => {
  const styles = getTextEffectStyle(
    effect?.name || 'none',
    effect?.settings as EffectSettings,
    colors[0],
    fontSizes[0]
  );
  const textId = `text-${id}`;
  useEffect(() => {
    const testEl = document.getElementById(textId);
    if (testEl) {
      testEl.innerHTML = text;
    }
  }, [text]);
  return (
    <div
      id={textId}
      className={`canva-editor-text`}
      css={{
        p: {
          '&:before': {
            ...styles,
          },
        },
        ...styles,
      }}
    />
  );
};
