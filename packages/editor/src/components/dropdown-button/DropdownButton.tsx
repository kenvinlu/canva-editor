import { useState, useRef, useEffect, FC, ReactNode } from 'react';
import ArrowRightIcon from 'canva-editor/icons/ArrowRightIcon';
import './DropdownButton.css';
import useMobileDetect from 'canva-editor/hooks/useMobileDetect';

export type DropdownMenuItem = {
  label: string;
  shortcut?: string;
  action?: (...args: any[]) => void;
  icon?: ReactNode;
  type?: 'normal' | 'submenu' | 'divider' | 'groupname';
  items?: DropdownMenuItem[];
  disabled?: boolean;
  hint?: string;
};
interface Props {
  text: string | ReactNode;
  header?: ReactNode;
  items: DropdownMenuItem[];
}
const DropdownButton: FC<Props> = ({ text, header, items }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(-1);
  const dropdownRef = useRef<any>(null);
  const isMobile = useMobileDetect();

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  const handleButtonClick = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderMenuItem = (item: DropdownMenuItem, index: number) => {
    const submenuStyle: React.CSSProperties = isMobile
        ? {
            left: isMobile ? 6 : '100%', // Adjust the position based on isMobile
            top: isMobile ? '100%' : 0,
          }
        : {};
    const toggleSubmenu = () => {
      if (isMobile) setSubmenuOpen(submenuOpen === -1 ? index : -1);
    };

    if (item.type === 'divider') {
      return <div key={index} className='menu-divider'></div>;
    } else if (item.type === 'groupname') {
      return (
        <p key={index} className='menu-groupname'>
          {item.label}
        </p>
      );
    }

    const menuItemClassName = `menu-item ${
      item.type === 'submenu' ? 'with-submenu' : ''
    }`;

    const shouldRenderSubmenu = (idx: number) => {
      if (isMobile) {
        return submenuOpen === idx;
      }

      return true;
    }

    return (
      <div key={index} className={menuItemClassName}>
        <button
          disabled={item.disabled}
          onClick={(...args: any[]) => {
            toggleSubmenu();
            if (item.disabled || !item.action) return;
            item.action(...args);
            setShowMenu(false);
          }}
        >
          {item?.icon}
          <p
            css={{
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: 13,
              margin: 0
            }}
          >
            {item.label}
          </p>
          {item.hint && <p className='hint'>{item.hint}</p>}
          {item.type === 'submenu' && (
            <span className={`submenu-arrow ${submenuOpen === index ? 'open' : ''}`}>
              <ArrowRightIcon />
            </span>
          )}
          {item.shortcut && (
            <span className='shortcut'>
              <kbd>{item.shortcut}</kbd>
            </span>
          )}
        </button>
        {shouldRenderSubmenu(index) && item.items && (
          <div className='submenu' style={submenuStyle}>
            {item.items.map((submenuItem, subIndex) =>
              renderMenuItem(submenuItem, subIndex)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='dropdown' ref={dropdownRef}>
      <button
        className={`dropdown-button ${showMenu ? 'is-active' : ''}`}
        onClick={handleButtonClick}
      >
        {text}
      </button>
      {showMenu && (
        <div className='dropdown-menu'>
          {header && (
            <>
              {header}
              <div key={-1} className='menu-divider'></div>
            </>
          )}
          {items.map((item: DropdownMenuItem, index: number) =>
            renderMenuItem(item, index)
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
