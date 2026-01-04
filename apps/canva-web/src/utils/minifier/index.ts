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
  if (typeof obj !== "object" || obj === null) {
    return [obj, mapping];
  }

  if (Array.isArray(obj)) {
    const packedArray: any = [];

    for (const item of obj) {
      const [packedItem, updatedMapping] = pack(item, mapping, charCode);
      packedArray.push(packedItem);
      mapping = updatedMapping;
    }

    return [packedArray, mapping];
  }

  const packedObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (!mapping[key]) {
        mapping[key] = getAlphabetCharByOrder(charCode);
        charCode++;
      }
      const [packedValue, updatedMapping] = pack(obj[key], mapping, charCode);
      packedObj[mapping[key] || key] = packedValue;
      charCode = Math.max(charCode, Object.keys(updatedMapping).length + 1);

      mapping = { ...mapping, ...updatedMapping };
    }
  }

  return [packedObj, mapping];
};

const unpack = (packed: any, dataMapping?: any): any => {
  if (!packed) {
    return packed;
  }
  if (Array.isArray(packed)) {
    const unpackedArray: any = [];
    for (const item of packed) {
      unpackedArray.push(unpack(item, dataMapping));
    }

    return unpackedArray;
  }

  if (typeof packed === "object") {
    const unpackedObj: any = {};
    for (const key in packed) {
      if (Object.prototype.hasOwnProperty.call(packed, key)) {
        const originalKey = Object.keys(dataMapping).find((k) => dataMapping[k] === key) || key;
        unpackedObj[originalKey] = unpack(packed[key]);
      }
    }
    return unpackedObj;
  }

  return packed;
};

export { pack, unpack };
