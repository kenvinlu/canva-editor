import React, { FC, Fragment, PropsWithChildren, useMemo } from 'react';
import SettingButton from './SettingButton';
import ColorSidebar from './sidebar/ColorSidebar';
import { useEditor } from 'canva-editor/hooks';
import { getGradientBackground } from 'canva-editor/layers';
import { GradientStyle } from 'canva-editor/types';
import { ColorParser } from '../../color-picker/utils';

interface ColorSettingsProps {
  colors: string[];
  gradient?: { colors: string[]; style: GradientStyle } | null;
  useGradient?: boolean;
  onChange: (color: string) => void;
  onClickCallback?: () => void;
  onChangeGradient?: (gradient: {
    colors: string[];
    style: GradientStyle;
  }) => void;
}
const ColorSettings: FC<PropsWithChildren<ColorSettingsProps>> = ({
  colors,
  gradient,
  useGradient,
  children,
  onChange,
  onChangeGradient,
  onClickCallback,
}) => {
  const { actions, sidebar } = useEditor((state) => ({
    sidebar: state.sidebar,
  }));

  const linearGradient = useMemo(() => {
    if (
      (colors.length === 0 ||
        (colors.length === 1 && new ColorParser(colors[0]).white() === 100)) &&
      !gradient
    ) {
      return 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)';
    }
    if (gradient) {
      return getGradientBackground(gradient.colors, gradient.style);
    }
    return colors
      .map((color) => `linear-gradient(to right, ${color}, ${color})`)
      .join(', ');
  }, [colors]);
  return (
    <Fragment>
      <SettingButton
        onClick={() => {
          actions.setSidebar('CHOOSING_COLOR');
          if (onClickCallback) onClickCallback();
        }}
      >
        {!children && (
          <div
            css={{
              width: 24,
              height: 24,
              boxShadow: 'inset 0 0 0 1px rgba(57,76,96,.15)',
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              css={{
                backgroundColor: '#fff',
                backgroundPosition: '0 0, 6px 6px',
                backgroundSize: '12px 12px',
                inset: 0,
                position: 'absolute',
                backgroundImage:
                  'linear-gradient(-45deg,rgba(57,76,96,.15) 25%,transparent 25%,transparent 75%,rgba(57,76,96,.15) 75%),linear-gradient(-45deg,rgba(57,76,96,.15) 25%,transparent 25%,transparent 75%,rgba(57,76,96,.15) 75%)',
              }}
            >
              <div
                css={{
                  position: 'absolute',
                  inset: 0,
                  background: linearGradient,
                }}
              />
            </div>
          </div>
        )}
        {children}
      </SettingButton>
      {sidebar === 'CHOOSING_COLOR' && (
        <ColorSidebar
          open={true}
          selected={colors.length === 1 ? colors[0] : null}
          gradient={gradient}
          useGradient={useGradient}
          onChangeGradient={onChangeGradient}
          onSelect={onChange}
        />
      )}
    </Fragment>
  );
};

export default ColorSettings;
