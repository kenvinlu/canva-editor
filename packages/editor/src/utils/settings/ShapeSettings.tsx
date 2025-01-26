import { FC, Fragment, ReactElement, useMemo, useRef, useState } from 'react';
import SettingButton from './SettingButton';
import ColorSettings from './ColorSettings';
import Popover from 'canva-editor/components/popover/Popover';
import Slider from 'canva-editor/components/slider/Slider';
import { useEditor } from 'canva-editor/hooks';
import { ShapeLayerProps } from 'canva-editor/layers/ShapeLayer';
import { Layer, ShapeBorderStyle, GradientStyle } from 'canva-editor/types';

// Icons
import ShapeSettingsIcon from 'canva-editor/icons/ShapeSettingsIcon';
import LongDashIcon from 'canva-editor/icons/LongDashIcon';
import TwoDashesIcon from 'canva-editor/icons/TwoDashesIcon';
import ThreeDashesIcon from 'canva-editor/icons/ThreeDashesIcon';
import DotsIcon from 'canva-editor/icons/DotsIcon';
import NotAllowedIcon from 'canva-editor/icons/NotAllowedIcon';
import SquareBoldIcon from 'canva-editor/icons/SquareBoldIcon';
import SettingDivider from './components/SettingDivider';

interface ShapeSettingsProps {
  layers: Layer<ShapeLayerProps>[];
}
const shapeStyles: { type: ShapeBorderStyle; icon: ReactElement }[] = [
  {
    type: 'none',
    icon: <NotAllowedIcon />,
  },
  { type: 'solid', icon: <LongDashIcon /> },
  { type: 'longDashes', icon: <TwoDashesIcon /> },
  { type: 'shortDashes', icon: <ThreeDashesIcon /> },
  { type: 'dots', icon: <DotsIcon /> },
];
const ShapeSettings: FC<ShapeSettingsProps> = ({ layers }) => {
  const [colorSetting, setColorSetting] = useState('background');
  const borderRef = useRef<HTMLDivElement>(null);
  const { actions, activePage } = useEditor((state) => ({
    activePage: state.activePage,
  }));
  const [openBorderSetting, setOpenBorderSetting] = useState(false);

  const roundedCorners = layers.reduce((value, layer) => {
    if (value < layer.data.props.roundedCorners) {
      value = layer.data.props.roundedCorners;
    }
    return value;
  }, 0);

  const updateRoundedCorners = (value: number) => {
    const layerIds = layers.map((l) => l.id);
    actions.history
      .throttle(2000)
      .setProp<ShapeLayerProps>(activePage, layerIds, {
        roundedCorners: value,
      });
  };
  const colors = useMemo(() => {
    return layers
      .filter((l) => l.data.props.color && !l.data.props.gradientBackground)
      .map((layer) => layer.data.props.color) as string[];
  }, [layers]);
  const gradient = useMemo(() => {
    return layers
      .map((layer) => layer.data.props.gradientBackground)
      .filter((c) => !!c);
  }, [layers]);
  const border = useMemo(() => {
    const border = layers
      .map((layer) => layer.data.props.border)
      .filter((b) => !!b);
    if (border[0]) {
      return border[0];
    }
    return {
      style: 'none' as ShapeBorderStyle,
      weight: 0,
      color: 'rgb(0, 0, 0)',
    };
  }, [layers]);
  const updateBackgroundColor = (color: string) => {
    layers.forEach((layer) => {
      actions.history
        .throttle(2000)
        .setProp<ShapeLayerProps>(activePage, layer.id, {
          color,
          gradientBackground: null,
        });
    });
  };

  const handleChangeGradient = (data: {
    colors: string[];
    style: GradientStyle;
  }) => {
    layers.forEach((layer) => {
      actions.history
        .throttle(2000)
        .setProp<ShapeLayerProps>(activePage, layer.id, {
          gradientBackground: data,
        });
    });
  };

  const updateBorderStyle = (style: ShapeBorderStyle) => {
    layers.forEach((layer) => {
      actions.history
        .throttle(2000)
        .setProp<ShapeLayerProps>(activePage, layer.id, {
          border: {
            style: style,
            weight: style === 'none' ? 0 : layer.data.props.border?.weight || 4,
            color: layer.data.props.border?.color || 'rgb(0, 0, 0)',
          },
        });
    });
  };
  const updateBorderWeight = (weight: number) => {
    const layerIds = layers.map((layer) => layer.id);
    actions.history
      .throttle(2000)
      .setProp<ShapeLayerProps>(activePage, layerIds, {
        border: {
          style: (weight === 0 ? 'none' : border.style) || 'solid',
          weight,
          color: border.color,
        },
      });
  };
  const updateBorderColor = (color: string) => {
    const layerIds = layers
      .filter((layer) => layer.data.props.border?.weight)
      .map((layer) => layer.id);
    actions.history
      .throttle(2000)
      .setProp<ShapeLayerProps>(activePage, layerIds, {
        border: {
          color,
        },
      });
  };
  const onUpdateColor = (color: string) => {
    if (colorSetting === 'background') {
      updateBackgroundColor(color);
    } else if (colorSetting === 'border') {
      updateBorderColor(color);
    }
  };
  return (
    <Fragment>
      <div
        css={{
          display: 'grid',
          alignItems: 'center',
          gridAutoFlow: 'column',
          gridGap: 8,
        }}
      >
        <ColorSettings
          colors={colors}
          useGradient={true}
          gradient={gradient.length > 0 ? gradient[0] : null}
          onChange={onUpdateColor}
          onChangeGradient={handleChangeGradient}
          onClickCallback={() => {
            setColorSetting('background');
          }}
        />
        {border && border.weight > 0 && (
          <Fragment>
            <ColorSettings
              colors={[border.color]}
              onChange={onUpdateColor}
              onClickCallback={() => {
                setColorSetting('border');
              }}
            >
              <div
                css={{
                  width: 24,
                  height: 24,
                  borderRadius: 2,
                  position: 'relative',
                  fontSize: 24,
                  overflow: 'hidden',
                  color: border.color,
                }}
              >
                <SquareBoldIcon />
              </div>
            </ColorSettings>
          </Fragment>
        )}
        <SettingButton
          ref={borderRef}
          css={{ fontSize: 20 }}
          onClick={() => setOpenBorderSetting(true)}
        >
          <ShapeSettingsIcon />
        </SettingButton>
        <SettingDivider />
        <Popover
          open={openBorderSetting}
          anchorEl={borderRef.current}
          placement={'bottom'}
          onClose={() => setOpenBorderSetting(false)}
          offsets={{
            'bottom-end': { x: 0, y: 8 },
          }}
        >
          <div css={{ padding: 16, display: 'grid', gap: 12 }}>
            <div>
              <div
                css={{
                  display: 'grid',
                  gridAutoFlow: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {shapeStyles.map((style) => (
                  <div
                    key={style.type}
                    css={{
                      fontSize: 24,
                      borderRadius: 4,
                      boxShadow:
                        style.type === border?.style
                          ? 'inset 0 0 0 2px #3d8eff'
                          : 'inset 0 0 0 1px rgba(43,59,74,.3)',
                      padding: 8,
                      cursor: 'pointer',
                      ':hover': {
                        boxShadow:
                          style.type !== border?.style
                            ? 'inset 0 0 0 1px rgba(28,39,48,.5)'
                            : undefined,
                      },
                    }}
                    onClick={() => updateBorderStyle(style.type)}
                  >
                    {style.icon}
                  </div>
                ))}
              </div>
            </div>

            <Slider
              label={'Border Weight'}
              value={border?.weight || 0}
              onChange={updateBorderWeight}
            />

            {layers.length === 1 &&
              (
                <Slider
                  label={'Corner Rounding'}
                  value={roundedCorners}
                  onChange={updateRoundedCorners}
                />
              )}
          </div>
        </Popover>
      </div>
    </Fragment>
  );
};

export default ShapeSettings;
