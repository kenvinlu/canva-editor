import React, { FC, PropsWithChildren, ReactElement, useState } from 'react';
import ArrowRightIcon from 'canva-editor/icons/ArrowRightIcon';
interface ContextMenuItemProps {
    name: string;
    icon: ReactElement;
    shortcut?: string;
    disabled?: boolean;
    onClick?: () => void;
}
const ContextMenuItem: FC<PropsWithChildren<ContextMenuItemProps>> = ({
    name,
    icon,
    shortcut,
    disabled = false,
    children,
    onClick,
}) => {
    const [showSub, setShowSub] = useState(false);
    return (
        <div
            css={{
                padding: '8px 16px 8px 8px',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                color: disabled ? 'rgba(36,49,61,.4)' : 'rgb(13, 18, 22)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                ':hover': {
                    background: disabled ? undefined : 'rgba(64,87,109,.07)',
                },
            }}
            onMouseOver={() => setShowSub(true)}
            onMouseOut={() => setShowSub(false)}
            onMouseLeave={() => setShowSub(false)}
            onClick={() => !disabled && onClick && onClick()}
        >
            <div
                css={{
                    fontSize: 20,
                }}
            >
                {icon}
            </div>
            <div css={{ marginLeft: 8, fontSize: 14, flexGrow: 1, whiteSpace: 'nowrap' }}>{name}</div>
            <div
                css={{
                    width: 48,
                    paddingLeft: 8,
                    '@media (max-width: 900px)': {
                        display: 'none',
                    },
                }}
            />
            {(children || shortcut) && (
                <div
                    css={{
                        height: 24,
                        lineHeight: '24px',
                        fontSize: shortcut ? 12 : 20,
                        padding: shortcut ? '0 8px' : 0,
                        marginLeft: 8,
                        background: shortcut ? 'rgba(64,87,109,.07)' : undefined,
                        borderRadius: 4,
                        whiteSpace: 'nowrap',
                        '@media (max-width: 900px)': {
                            display: 'none',
                        },
                    }}
                >
                    {shortcut}
                    {children && <ArrowRightIcon />}
                </div>
            )}
            {showSub && children}
        </div>
    );
};

export default ContextMenuItem;
