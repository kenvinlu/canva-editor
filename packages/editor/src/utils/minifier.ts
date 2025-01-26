import { isEditorID } from './identityGenerator';

export const dataMapping: any = {
  name: 'a',
  notes: 'b',
  layers: 'c',
  ROOT: 'd',
  type: 'e',
  resolvedName: 'f',
  props: 'g',
  boxSize: 'h',
  width: 'i',
  height: 'j',
  position: 'k',
  x: 'l',
  y: 'm',
  rotate: 'n',
  color: 'o',
  image: 'p',
  gradientBackground: 'q',
  locked: 'r',
  child: 's',
  parent: 't',
  scale: 'u',
  text: 'v',
  fonts: 'w',
  family: 'x',
  url: 'y',
  style: 'z',
  styles: 'aa',
  colors: 'ab',
  fontSizes: 'ac',
  effect: 'ad',
  settings: 'ae',
  thickness: 'af',
  transparency: 'ag',
  clipPath: 'ah',
  shapeSize: 'ai',
  thumb: 'aj',
  offset: 'ak',
  direction: 'al',
  blur: 'am',
  border: 'an',
  weight: 'ao',
};

function getAlphabetCharByOrder(order: number) {
  const alphabetLength = 26;

  if (order <= alphabetLength) {
    return String.fromCharCode(96 + order); // 'a' là 97
  } else {
    const firstCharOrder = Math.floor((order - 1) / alphabetLength);
    const secondCharOrder = ((order - 1) % alphabetLength) + 1;

    const firstChar = String.fromCharCode(96 + firstCharOrder);
    const secondChar = String.fromCharCode(96 + secondCharOrder);

    return firstChar + secondChar;
  }
}

const pack = (obj: any, mapping: any = {}, charCode = 1): any => {
  if (typeof obj !== 'object' || obj === null) {
    return [obj, mapping];
  }

  if (Array.isArray(obj)) {
    const packedArray: any = [];

    for (let i = 0; i < obj.length; i++) {
      const [packedItem, updatedMapping] = pack(obj[i], mapping, charCode);
      packedArray.push(packedItem);
      mapping = updatedMapping;
    }
    return [packedArray, mapping];
  }

  const packedObj: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (!mapping[key]) {
        if (!isEditorID(key)) {
          mapping[key] = getAlphabetCharByOrder(charCode);
          charCode++;
        }
      } else {
      }
      const [packedValue, updatedMapping] = pack(obj[key], mapping, charCode);
      packedObj[mapping[key] || key] = packedValue;
      charCode = Math.max(charCode, Object.keys(updatedMapping).length + 1);

      mapping = { ...mapping, ...updatedMapping };
    }
  }

  return [packedObj, mapping];
};

const unpack = (packed: any): any => {
  if (!packed) return packed;
  if (Array.isArray(packed)) {
    const unpackedArray: any = [];
    for (let i = 0; i < packed.length; i++) {
      unpackedArray.push(unpack(packed[i]));
    }
    return unpackedArray;
  }

  if (typeof packed === 'object') {
    const unpackedObj: any = {};
    for (const key in packed) {
      if (packed.hasOwnProperty(key)) {
        const originalKey =
          Object.keys(dataMapping).find((k) => dataMapping[k] === key) || key;
        unpackedObj[originalKey] = unpack(packed[key]);
      }
    }
    return unpackedObj;
  }

  return packed;
};

export { pack, unpack };
