import React, { createContext, FC, PropsWithChildren } from 'react';
export const PageContext = createContext<{ pageIndex: number }>({} as { pageIndex: number });

type PageProviderProps = {
    pageIndex: number;
};
const PageProvider: FC<PropsWithChildren<PageProviderProps>> = ({ pageIndex, children }) => {
    return <PageContext.Provider value={{ pageIndex }}>{children}</PageContext.Provider>;
};
export default PageProvider;
