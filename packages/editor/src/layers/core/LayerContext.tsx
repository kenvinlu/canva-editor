import { LayerId } from 'canva-editor/types';
import React, { createContext, FC, PropsWithChildren } from 'react';

export const LayerContext = createContext<{ id: LayerId }>({} as { id: LayerId });

type LayerProviderProps = {
    id: LayerId;
};
const LayerProvider: FC<PropsWithChildren<LayerProviderProps>> = ({ id, children }) => {
    return <LayerContext.Provider value={{ id }}>{children}</LayerContext.Provider>;
};
export default LayerProvider;
