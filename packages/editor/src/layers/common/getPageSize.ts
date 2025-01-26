import { BoxSize, SerializedPage } from '../../types';

export const getPageSize = (data: SerializedPage[]) => {
    if (data.length === 0) {
        throw new Error('Incorrect data');
    }
    return data[0].layers.ROOT.props.boxSize as BoxSize;
};
