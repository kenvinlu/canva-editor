import {
  ButtonHTMLAttributes,
  forwardRef,
  ForwardRefRenderFunction,
  PropsWithChildren,
} from 'react';
import { Tooltip as ReactTooltip } from 'canva-editor/tooltip';
import { ColorParser } from '../utils';

interface ColorIconProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'selected'> {
  color: string;
  selected: string | null;
}
const ColorIcon: ForwardRefRenderFunction<
  HTMLButtonElement,
  PropsWithChildren<ColorIconProps>
> = ({ color, selected, ...props }, ref) => {
  const colorId = `c_${color.replace('#', '')}`;
  return (
    <button
      ref={ref}
      type='button'
      data-tooltip-id={colorId}
      css={{
        paddingBottom: '100%',
        position: 'relative',
        width: '100%',
      }}
      {...props}
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
            borderRadius: 4,
            overflow: 'hidden',
            background: color,
            width: '100%',
            height: '100%',
            position: 'absolute',
            boxShadow: 'inset 0 0 0 1px rgba(57,76,96,.15)',
          }}
        />
        <div
          css={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: 4,
            boxShadow:
              selected &&
              new ColorParser(selected).toRgbString() ===
                new ColorParser(color).toRgbString()
                ? `0 0 0 1px #3d8eff,inset 0 0 0 1px #009ef7,inset 0 0 0 3px #fff`
                : undefined,
          }}
        />
      </div>
      <ReactTooltip id={colorId} content={color} />
    </button>
  );
};

export default forwardRef<HTMLButtonElement, ColorIconProps>(ColorIcon);
