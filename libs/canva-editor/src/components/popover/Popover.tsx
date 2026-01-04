import { forwardRef, ForwardRefRenderFunction, PropsWithChildren, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import PopoverWrapper, { PopoverProps } from './PopoverWrapper';

const Popover: ForwardRefRenderFunction<
    HTMLDivElement,
    PropsWithChildren<PopoverProps & { element?: HTMLDivElement | null }>
> = ({ open, children, element, ...props }, ref) => {
    const [container] = useState(window.document.createElement('div'));
    useEffect(() => {
        !element && window.document.body.appendChild(container);
        return () => {
            !element && window.document.body.removeChild(container);
        };
    }, [element, container, open]);
    const child = (
        <PopoverWrapper ref={ref} open={open} {...props}>
            {children}
        </PopoverWrapper>
    );
    return open ? ReactDOM.createPortal(child, element || container) : null;
};

export default forwardRef<HTMLDivElement, PropsWithChildren<PopoverProps & { element?: HTMLDivElement | null }>>(
    Popover,
);
