import React, { forwardRef, ForwardRefRenderFunction, PropsWithChildren, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

export interface SidebarProps {
    open: boolean;
}
const Sidebar: ForwardRefRenderFunction<HTMLDivElement, PropsWithChildren<SidebarProps>> = (
    { open, children },
    ref,
) => {
    const [container, setContainer] = useState(window.document.getElementById('settings'));
    const child = (
        <div
            ref={ref}
            css={{
                background: '#fff',
                width: '100%',
                height: '100%',
                overflowY: 'auto',
                pointerEvents: 'auto',
                '@media (max-width: 900px)': {
                    width: '100%',
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    top: 0,
                    background: '#fff',
                },
            }}
        >
            {children}
        </div>
    );
    useEffect(() => {
        setContainer(window.document.getElementById('settings'));
    }, []);
    if (!container) {
        return null;
    }
    return open ? ReactDOM.createPortal(child, container) : null;
};
export default forwardRef<HTMLDivElement, PropsWithChildren<SidebarProps>>(Sidebar);
