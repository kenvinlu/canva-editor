import { ColorModel, ColorPickerBaseProps } from '../types';
import { equalHex } from '../utils/equalColorObjects';
import { BaseColorPicker } from './BaseColorPicker';
import { hex2hsv, hsv2hex } from '../utils';

const colorModel: ColorModel<string> = {
    defaultColor: '000',
    toHsva: hex2hsv,
    fromHsva: ({ h, s, v, a }) => hsv2hex({ h, s, v, a }),
    equal: equalHex,
};

const ColorPicker = (props: Partial<ColorPickerBaseProps<string>>) => (
    <BaseColorPicker {...props} colorModel={colorModel} />
);

export default ColorPicker;
