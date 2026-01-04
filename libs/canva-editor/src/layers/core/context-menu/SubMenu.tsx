import { getTransformStyle } from 'canva-editor/layers';
import { Delta } from 'canva-editor/types';
import React, { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';

interface SubMenuProps {
    transform: Delta;
}
const SubMenu: FC<PropsWithChildren<SubMenuProps>> = ({ transform, children }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState<{ x: number; y: number }>({ x: -9999, y: -9999 });
    useEffect(() => {
        if (ref.current && ref.current.parentElement) {
            const offset = {
                x: 0,
                y: 0,
            };
            const parentRect = ref.current.parentElement;
            const rect = ref.current.getBoundingClientRect();
            if (transform.y + parentRect.offsetTop + rect.height > window.innerHeight) {
                offset.y =
                    parentRect.offsetTop - (transform.y + parentRect.offsetTop + rect.height - window.innerHeight);
            } else {
                offset.y = parentRect.offsetTop;
            }
            if (transform.x + parentRect.offsetWidth + rect.width > window.innerWidth) {
                offset.x = -rect.width;
            } else {
                offset.x = parentRect.offsetLeft + parentRect.offsetWidth;
            }
            setOffset(offset);
        }
    }, [transform]);
    return (
        <div
            ref={ref}
            css={{
                position: 'fixed',
                top: 0,
                left: 0,
                transform: getTransformStyle({
                    position: offset,
                }),
                paddingLeft: 8,
                paddingRight: 8,
            }}
        >
            <div
                css={{
                    background: 'white',
                    paddingTop: 8,
                    paddingBottom: 8,
                    borderRadius: 4,
                    zIndex: 30,
                    boxShadow: '0 0 0 1px rgba(64,87,109,.07),0 2px 12px rgba(53,71,90,.2)',
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default SubMenu;
