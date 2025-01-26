import { HSLAColor, HSVAColor, HSVColor, RGBAColor } from './types';
import { isRGB } from './isRGB';
import { isHSL } from './isHSL';
import { hsv2hwb } from './hsv2hwb';
import { hwb2hsv } from './hwb2hsv';
import { parseColor } from './helper';
import { rgb2hsv } from './rgb2hsv';
import { hsl2hsv } from './hsl2hsv';
import { hsv2hsl } from './hsv2hsl';
import { hsv2rgb } from './hsv2rgb';
import { hsv2hex } from './hsv2hex';

export default class ColorParser {
  private _color: HSVColor;
  private _alpha: number;

  constructor(color: string | RGBAColor | HSLAColor | HSVAColor) {
    if (typeof color === 'string') {
      const c = parseColor(color);
      this._color = c;
      this._alpha = c.a || 1;
    } else if (isRGB(color)) {
      this._color = rgb2hsv(color);
      this._alpha = color.a || 1;
    } else if (isHSL(color)) {
      this._color = hsl2hsv(color);
      this._alpha = color.a || 1;
    } else {
      this._color = color;
      this._alpha = color.a || 1;
    }
  }
  alpha(alpha: number) {
    this._alpha = alpha;
    return this;
  }

  white() {
    return this.toHwb().w;
  }
  darken(ratio: number) {
    const hsl = this.toHsl();
    hsl.l = Math.min(100, Math.max(hsl.l - hsl.l * ratio, 0));
    this._color = hsl2hsv(hsl);
    return this;
  }
  whiten(ratio: number) {
    const hwb = this.toHwb();
    hwb.w = Math.min(100, Math.max(hwb.w + hwb.w * ratio, 0));
    this._color = hwb2hsv(hwb, this._alpha);
    return this;
  }

  shadeHexColor(percent: number) {
    const rgb = hsv2rgb({ ...this._color, a: this._alpha });
    var t = percent < 0 ? 0 : 255,
      p = percent < 0 ? percent * -1 : percent;
    return (
      'rgb(' +
      (Math.round((t - rgb.r) * p) + rgb.r) +
      ',' +
      (Math.round((t - rgb.g) * p) + rgb.g) +
      ',' +
      (Math.round((t - rgb.b) * p) + rgb.b) +
      ')'
    );
  }

  blacken(ratio: number) {
    const hwb = this.toHwb();
    hwb.b = Math.min(100, Math.max(hwb.b + hwb.b * ratio, 0));
    this._color = hwb2hsv(hwb, this._alpha);
    return this;
  }

  toHwb() {
    return hsv2hwb(this._color);
  }
  toHsl() {
    return hsv2hsl({ ...this._color, a: this._alpha });
  }
  toRgbString() {
    const rgb = hsv2rgb({ ...this._color, a: this._alpha });
    return `rgb${rgb.a !== 1 ? 'a' : ''}(${rgb.r}, ${rgb.g}, ${rgb.b}${
      rgb.a !== 1 ? `, ${rgb.a}` : ''
    })`;
  }

  toHex() {
    return hsv2hex({ ...this._color, a: this._alpha });
  }
  isLight() {
    return this._color.v > 50;
  }

  lightness() {
    return this._color.v;
  }

  lighten(ratio: number) {
    const hsv = this._color;
    hsv.v = Math.min(100, Math.max(hsv.v + hsv.v * ratio, 0));
    this._color = hsv;
    return this;
  }
}
