import { CSSObject } from '@emotion/react';
import { ColorParser } from '../../color-picker/utils';
import { EffectSettings } from '../../types';
/*
text-shadow from smooth-16 was created with steps = 16
*/
function calculateStrokeTextCSS(steps: number) {
  var css = "";
  for (var i = 0; i < steps; i++) {
    var angle = (i * 2 * Math.PI) / steps;
    var cos = Math.round(10000 * Math.cos(angle)) / 10000;
    var sin = Math.round(10000 * Math.sin(angle)) / 10000;
    css +=
      "calc(var(--stroke-width) * " +
      cos +
      ") calc(var(--stroke-width) * " +
      sin +
      ") 0 var(--stroke-color),";
  }

  return css.slice(0, -1); // Remove last comma
}

export const getTextEffectStyle = (
  effect: string,
  settings: EffectSettings,
  textColor: string,
  fontSize: number
) => {
  const res: CSSObject = {};
  switch (effect) {
    case 'shadow': {
      const color = new ColorParser(settings.color as string);
      const radians = ((settings.direction || 0) * Math.PI) / 180;

      const x =
        (settings.offset || 0) * 0.00183334 * fontSize * Math.sin(radians);
      const y =
        (settings.offset || 0) * 0.00183334 * fontSize * Math.cos(radians);
      res.textShadow = `${color
        .alpha((settings.transparency || 0) / 100)
        .toRgbString()} ${x}px ${y}px ${settings.blur}px`;
      break;
    }
    case 'lift': {
      const color = new ColorParser(settings.color as string);
      color.alpha(0.05 + (settings?.intensity || 0) * 0.005);
      res.textShadow = `${color.toRgbString()} 0px ${Math.max(
        0.45,
        fontSize * 0.05
      )}px ${
        Math.max(0.45, fontSize * 0.05) + (settings?.intensity || 0) * 0.065
      }px; filter: opacity(1)`;
      break;
    }
    case 'hollow': {
      res.caretColor = textColor;
      res.WebkitTextFillColor = 'transparent';
      res.WebkitTextStroke = `${
        (0.0091666 + 0.000833325 * (settings?.thickness || 0)) * fontSize
      }px ${textColor}`;
      break;
    }
    case 'splice': {
      res.caretColor = textColor;
      res.WebkitTextFillColor = 'transparent';
      const thickness = settings?.thickness || 0;
      res.WebkitTextStroke = `${
        Math.max(8, fontSize) * 0.00916666 +
        (0.00166666 / 2) * fontSize * thickness
      }px ${textColor}`;
      const radians = ((settings?.direction || 0) * Math.PI) / 180;
      const x =
        (settings?.offset || 0) * 0.00183334 * fontSize * Math.sin(radians);
      const y =
        (settings?.offset || 0) * 0.00183334 * fontSize * Math.cos(radians);
      res.textShadow = `${settings.color} ${x}px ${y}px 0px`;
      break;
    }
    case 'outline': {
      const thickness = (settings?.thickness || 1)*6/200; // Stroke width maximum is 6px

      res.color = textColor;
      res['--stroke-color'] = settings.color;
      res['--stroke-width'] = thickness + 'px';
      res.letterSpacing = 'var(--stroke-width)';
      res.textShadow = calculateStrokeTextCSS(16);
      break;
    }
    case 'echo': {
      const color = new ColorParser(settings.color as string);
      const radians = ((settings?.direction || 0) * Math.PI) / 180;

      const x =
        (settings?.offset || 0) * 0.00166666 * fontSize * Math.sin(radians);
      const y =
        (settings?.offset || 0) * 0.00166666 * fontSize * Math.cos(radians);
      res.textShadow = `${color
        .alpha(0.5)
        .toRgbString()} ${x}px ${y}px 0px, ${color.alpha(0.3).toRgbString()} ${
        x * 2
      }px ${y * 2}px 0px`;
      break;
    }
    case 'neon': {
      const color = new ColorParser(textColor);
      const size =
        0.016766 * fontSize + 0.001004 * (settings?.intensity || 0) - 0.001004;
      const shadowColor = color.isLight()
        ? color
            .darken(Math.min(Math.max(2, 100 - color.lightness()), 10) * 0.02)
            .toRgbString()
        : color
            .lighten(Math.min(Math.max(2, color.lightness()), 10) * 0.02)
            .toRgbString();
      const blurShadowColor = color.isLight()
        ? color
            .darken(Math.min(Math.max(2, 100 - color.lightness()), 10) * 0.01)
            .toRgbString()
        : color
            .lighten(Math.min(Math.max(2, color.lightness()), 10) * 0.01)
            .toRgbString();
      res.filter = `drop-shadow(${shadowColor} 0px 0px ${size}px) drop-shadow(${blurShadowColor} 0px 0px ${
        size * 5
      }px) drop-shadow(${blurShadowColor} 0px 0px ${size * 15}px)`;
      res['--color-override'] = color.shadeHexColor(
        (settings?.intensity || 1) / 100
      );
      res['span'] = {
        color: 'var(--color-override)!important',
      };
      break;
    }
    case 'glitch': {
      const radians = ((settings?.direction || 0) * Math.PI) / 180;
      const offset = settings?.offset || 0;

      const x = offset * 0.00183334 * fontSize * Math.sin(radians);
      const y = offset * 0.00183334 * fontSize * Math.cos(radians);

      res.textShadow = `rgb(0, 255, 255) ${x}px ${y}px 0px, 
                   rgb(255, 0, 255) ${x * -1}px ${y * -1}px 0px`;

      res['--color-override'] = textColor;
      res['span'] = {
        color: 'var(--color-override)!important',
      };
      break;
    }
  }
  return res;
};
