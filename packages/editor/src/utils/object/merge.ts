import { isArray, mergeWith } from 'lodash';

export const mergeWithoutArray = <TObject, TSource>(
    obj: TObject,
    source: TSource,
    customizer?: (objVal: unknown, srcVal: unknown) => unknown,
): TObject & TSource => {
    if (isArray(obj) || isArray(source)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return source;
    }
    if (!customizer) {
        customizer = (objValue, srcValue) => {
            if (isArray(objValue)) {
                return srcValue;
            }
            return undefined;
        };
    }
    return mergeWith(obj, source, customizer);
};
