import { GradientStyle } from 'canva-editor/types';

export const defaultColors = [
  ['#000000', '#545454', '#737373', '#a6a6a6', '#d9d9d9', '#ffffff'],
  ['#ff3131', '#FF5757', '#FF66C4', '#CB6CE6', '#8C52FF', '#5E17EB'],
  ['#0097B2', '#0CC0DF', '#5CE1E6', '#38B6FF', '#5271FF', '#004AAD'],
  ['#00BF62', '#7ED957', '#C1FF72', '#FFDE59', '#FFBD59', '#FF914D'],
];

export const defaultGradientColors: {
  colors: string[];
  style: GradientStyle;
}[][] = [
  [
    {
      colors: ['rgb(0, 0, 0)', 'rgb(115, 115, 115) 100%'],
      style: 'leftToRight',
    },
    {
      colors: ['rgb(0, 0, 0)', 'rgb(200, 145, 22) 100%'],
      style: 'leftToRight',
    },
    { colors: ['rgb(0, 0, 0)', 'rgb(53, 51, 205) 100%'], style: 'leftToRight' },
    {
      colors: ['rgb(166, 166, 166)', 'rgb(255, 255, 255) 100%'],
      style: 'leftToRight',
    },
    {
      colors: ['rgb(255, 247, 173)', 'rgb(255, 169, 249) 100%'],
      style: 'leftToRight',
    },
    {
      colors: ['rgb(205, 255, 216)', 'rgb(148, 185, 255) 100%'],
      style: 'leftToRight',
    },
  ],
  [
    {
      colors: ['rgb(255, 49, 49)', 'rgb(255, 145, 77) 100%'],
      style: 'leftToRight',
    },
    {
      colors: ['rgb(255, 87, 87)', 'rgb(140, 82, 255) 100%'],
      style: 'leftToRight',
    },
    {
      colors: ['rgb(81, 112, 255)', 'rgb(255, 102, 196) 100%'],
      style: 'leftToRight',
    },
    {
      colors: ['rgb(0, 74, 173)', 'rgb(203, 108, 230) 100%'],
      style: 'leftToRight',
    },
    {
      colors: ['rgb(140, 82, 255)', 'rgb(92, 225, 230) 100%'],
      style: 'leftToRight',
    },
    {
      colors: ['rgb(93, 224, 230)', 'rgb(0, 74, 173) 100%'],
      style: 'leftToRight',
    },
  ],
  [
    {
      colors: ['rgb(140, 82, 255)', 'rgb(0, 191, 99) 100%'],
      style: 'leftToRight',
    },
    {
      colors: ['rgb(0, 151, 178)', 'rgb(126, 217, 87) 100%'],
      style: 'leftToRight',
    },
    {
      colors: ['rgb(12, 192, 223)', 'rgb(255, 222, 89) 100%'],
      style: 'leftToRight',
    },
    {
      colors: ['rgb(255, 222, 89)', 'rgb(255, 145, 77) 100%'],
      style: 'leftToRight',
    },
    {
      colors: ['rgb(255, 102, 196)', 'rgb(255, 222, 89) 100%'],
      style: 'leftToRight',
    },
    {
      colors: ['rgb(140, 82, 255)', 'rgb(255, 145, 77) 100%'],
      style: 'leftToRight',
    },
  ],
];
