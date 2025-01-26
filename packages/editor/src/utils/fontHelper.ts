import { FontData } from 'canva-editor/types';
import { chain, filter, find, omit } from 'lodash';

function groupFontsByFamily(fonts: FontData[]): FontData[] {
  return chain(fonts)
    .groupBy('family')
    .map((group) => {
      // Case the font has only one style
      if (group.length === 1) {
        return {
          ...group[0],
          styles: group,
        };
      }
      const regularItem: any = find(group, (item) =>
        item.name.toLowerCase().includes('regular')
      );

      if (regularItem) {
        const { name, ...rest } = regularItem;
        const { styles, ...familyObj } = omit(regularItem, ['name']);

        return {
          family: familyObj,
          name,
          ...rest,
          styles: group,
        };
      } else {
        return {
          ...group[0],
          styles: group,
        };
      }
    })
    .value();
}

function handleFontStyle(style: string) {
  if (style === 'regular') return '';

  const fontStrong = parseInt(style);
  if (style.includes('italic')) {
    // bold + italic
    const fontStyle = 'font-style: italic;\n';
    return fontStrong ? `font-weight: ${fontStrong};\n${fontStyle}` : fontStyle;
  }

  if (!fontStrong) return '';

  return `font-weight: ${fontStrong};\n`;
}

function getFontStrongName(weight: number) {
  switch (weight) {
    case 100:
      return 'Thin';
    case 200:
      return 'Extra Light';
    case 300:
      return 'Light';
    case 400:
      return 'Normal';
    case 500:
      return 'Medium';
    case 600:
      return 'Semi Bold';
    case 700:
      return 'Bold';
    case 800:
      return 'Extra Bold';
    case 900:
      return 'Black';
    default:
      return 'Unknown';
  }
}

function handleFontStyleName(style: string) {
  if (style === 'regular') return 'Regular';

  const fontStrong = parseInt(style);
  if (style.includes('italic')) {
    // bold + italic
    return fontStrong ? `${getFontStrongName(fontStrong)} + Italic` : 'Italic';
  }

  if (!fontStrong) return 'Regular';

  return getFontStrongName(fontStrong);
}

export { groupFontsByFamily, handleFontStyle, handleFontStyleName };
