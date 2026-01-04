'use client';

import { ChangeEvent, FC, useMemo, useRef, useState, useEffect } from 'react';
import DropdownButton, {
  DropdownMenuItem,
} from 'canva-editor/components/dropdown-button/DropdownButton';
import { useEditor } from 'canva-editor/hooks';
import { downloadObjectAsJson } from 'canva-editor/utils/download';
import QuickBoxDialog from 'canva-editor/components/dialog/QuickBoxDialog';
import UploadIcon from 'canva-editor/icons/UploadIcon';
import DownloadIcon from 'canva-editor/icons/DownloadIcon';
import AddNewPageIcon from 'canva-editor/icons/AddNewPageIcon';
import ResizeIcon from 'canva-editor/icons/ResizeIcon';
import LockIcon from 'canva-editor/icons/LockIcon';
import LockOpenIcon from 'canva-editor/icons/LockOpenIcon';
import SyncedIcon from 'canva-editor/icons/SyncedIcon';
import HelpIcon from 'canva-editor/icons/HelpIcon';
import ConfigurationIcon from 'canva-editor/icons/ConfigurationIcon';
import ExportIcon from 'canva-editor/icons/ExportIcon';
import EditorButton from 'canva-editor/components/EditorButton';
import PlayArrowIcon from 'canva-editor/icons/PlayArrowIcon';
import PreviewModal from './PreviewModal';
import FacebookIcon from 'canva-editor/icons/FacebookIcon';
import InstagramIcon from 'canva-editor/icons/InstagramIcon';
import { BoxSize } from 'canva-editor/types';
import { dataMapping, pack, unpack } from 'canva-editor/utils/minifier';
import HamburgerIcon from 'canva-editor/icons/HamburgerIcon';
import useMobileDetect from 'canva-editor/hooks/useMobileDetect';
import TrashIcon from 'canva-editor/icons/TrashIcon';
import { useTranslate } from 'canva-editor/contexts/TranslationContext';

interface Props {
  designName: string;
  onRemove: () => void;
}
const HeaderFileMenu: FC<Props> = ({ designName, onRemove }) => {
  const [mounted, setMounted] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);
  const isMobile = useMobileDetect();
  const { actions, query, activePage, pageSize, isPageLocked } = useEditor(
    (state) => ({
      activePage: state.activePage,
      sidebar: state.sidebar,
      pageSize: state.pageSize,
      isPageLocked:
        state.pages[state.activePage] &&
        state.pages[state.activePage].layers.ROOT.data.locked,
    })
  );
  const [openResizeSetting, setOpenResizeSetting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });
  const [lockSiteAspect, setLockSizeAspect] = useState(false);
  const widthRef = useRef<HTMLInputElement>(null);
  const heightRef = useRef<HTMLInputElement>(null);
  const t = useTranslate();
  const isDisabledResize = useMemo(
    () => (size?.width || 0) < 100 || (size?.height || 0) < 100,
    [size]
  );
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until client-side
  if (!mounted) {
    return null;
  }

  const menuData: DropdownMenuItem[] = [
    {
      label: t('header.createNewDesign', 'Create new design'),
      type: 'submenu',
      icon: <AddNewPageIcon />,
      items: [
        {
          label: t('header.customSize', 'Custom size'),
          type: 'normal',
          icon: <ResizeIcon />,
          action: () => {
            setSize({
              width: 0,
              height: 0,
            });
            setIsCreating(true);
            setOpenResizeSetting(true);
          },
        },
        {
          label: t('header.suggested', 'Suggested'),
          type: 'groupname',
        },
        {
          label: t('header.facebookPostLandscape', 'Facebook Post (Landscape)'),
          type: 'normal',
          icon: <FacebookIcon />,
          hint: '940 × 788 px',
          action: () => {
            handleCloseResizeBox();
            createNew({
              width: 940,
              height: 688,
            });
          },
        },
        {
          label: t('header.facebookCover', 'Facebook Cover'),
          type: 'normal',
          icon: <FacebookIcon />,
          hint: '1640 × 924 px',
          action: () => {
            handleCloseResizeBox();
            createNew({
              width: 1640,
              height: 924,
            });
          },
        },
        {
          label: t('header.instagramPostSquare', 'Instagram Post (Square)'),
          type: 'normal',
          icon: <InstagramIcon />,
          hint: '1080 × 1080 px',
          action: () => {
            handleCloseResizeBox();
            createNew({
              width: 1080,
              height: 1080,
            });
          },
        },
      ],
    },
    { label: 'Divider', type: 'divider' },
    {
      label: t('header.save', 'Save'),
      type: 'normal',
      icon: <SyncedIcon />,
      shortcut: t('header.allChangesSaved', 'All changes saved'),
      action: () => {},
    },
    {
      label: t('header.preview', 'Preview'),
      type: 'normal',
      icon: <PlayArrowIcon />,
      action: () => {
        setOpenPreview(true);
      },
    },
    {
      label: t('header.export', 'Export'),
      type: 'submenu',
      icon: <ExportIcon />,
      items: [
        {
          label: `${t('common.page', 'Page')} ${activePage + 1} ${t('header.asPNG', 'as PNG')}`,
          type: 'normal',
          action: () => {
            actions.fireDownloadPNGCmd(1);
          },
        },
        {
          label: t('header.exportAllPagesAsPNG', 'All pages as PNG'),
          type: 'normal',
          action: () => {
            actions.fireDownloadPNGCmd(0);
          },
        },
        {
          label: t('header.exportAllPagesAsPDF', 'All pages as PDF'),
          type: 'normal',
          action: () => {
            actions.fireDownloadPDFCmd(0);
          },
        },
      ],
    },

    { label: 'Divider', type: 'divider' },
    {
      label: t('header.viewSettings', 'View settings'),
      type: 'submenu',
      icon: <ConfigurationIcon />,
      items: [
        {
          label: t('header.resizePage', 'Resize page') + ` (${activePage + 1})`,
          type: 'normal',
          icon: <ResizeIcon />,
          disabled: isPageLocked,
          action: () => {
            setIsCreating(false);
            setSize(pageSize);
            setOpenResizeSetting(true);
          },
        },
      ],
    },
    { label: 'Divider', type: 'divider' },
    {
      label: t('header.import', 'Import'),
      type: 'normal',
      icon: <UploadIcon />,
      action: () => {
        uploadRef.current?.click();
      },
    },
    {
      label: t('header.download', 'Download'),
      type: 'normal',
      icon: <DownloadIcon />,
      action: () => {
        downloadObjectAsJson('file', pack(query.serialize(), dataMapping)[0]);
      },
    },
    {
      label: t('header.remove', 'Remove'),
      type: 'normal',
      icon: <span style={{ color: '#ed213a', paddingRight: 6 }}><TrashIcon /></span>,
      action: () => {
        onRemove();
      },
    },
    { label: 'Divider', type: 'divider' },
    {
      label: t('header.help', 'Help'),
      type: 'normal',
      icon: <HelpIcon />,
      shortcut: '⌘H',
      action: () => {
        actions.goToGithubPage();
      },
    },
  ];

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        const fileContent = JSON.parse(reader.result as string);
        actions.setData(unpack(fileContent));
      };
      reader.readAsText(file);
      e.target.value = '';
    }
  };

  const handleChangeSize = (value: string, type: 'width' | 'height') => {
    const ratio = (size?.width || 0) / (size?.height || 0);
    const v = parseInt(value, 10);
    if (type === 'width') {
      if (lockSiteAspect) {
        (heightRef.current as HTMLInputElement).value = String(
          Math.round((v / ratio) * 10) / 10
        );
      }
      setSize({ ...size, width: v || 0 });
    }
    if (type === 'height') {
      if (lockSiteAspect) {
        (widthRef.current as HTMLInputElement).value = String(
          Math.round(v * ratio * 10) / 10
        );
      }
      setSize({ ...size, height: v || 0 });
    }
  };

  const handleResize = () => {
    if (isDisabledResize) return;
    if (isCreating) {
      createNew(size);
    } else {
      actions.changePageSize(size);
    }
    handleCloseResizeBox();
  };

  const createNew = (boxSize: BoxSize) => {
    actions.setData([
      {
        name: '',
        notes: '',
        layers: {
          ROOT: {
            type: {
              resolvedName: 'RootLayer',
            },
            props: {
              boxSize,
              position: {
                x: 0,
                y: 0,
              },
              rotate: 0,
              color: 'rgb(255, 255, 255)',
              image: null,
            },
            locked: false,
            child: [],
            parent: null,
          },
        },
      },
    ]);
  };

  const handleCloseResizeBox = () => {
    setIsCreating(false);
    setSize({
      width: 0,
      height: 0,
    });
    setOpenResizeSetting(false);
  };

  return (
    <>
      <DropdownButton
        text={isMobile ? <HamburgerIcon /> : t('header.file', 'File')}
        items={menuData}
        header={
          <div css={{ padding: '16px 16px 8px' }}>
            <div css={{ fontSize: 18, fontWeight: 700, color: '#000' }}>
              {designName || t('header.untitledDesign', 'Untitled design')}
            </div>
            <div
              css={{
                fontSize: 13,
                color: '#909090',
                marginTop: 8,
                fontFamily: 'Arial',
              }}
            >{`${pageSize.width}px x ${pageSize.height}px`}</div>
          </div>
        }
      />
      <input
        ref={uploadRef}
        type='file'
        accept='application/json'
        onChange={handleImport}
        css={{ display: 'none' }}
      />
      <QuickBoxDialog open={openResizeSetting} onClose={handleCloseResizeBox}>
        <div css={{ padding: '0 16px 16px', width: 300 }}>
          <div css={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div>
              <div css={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                {t('common.width', 'Width')}
              </div>
              <div
                css={{
                  border: '1px solid rgba(43,59,74,.3)',
                  height: 40,
                  padding: '0 12px',
                  width: 80,
                  borderRadius: 4,
                }}
              >
                <input
                  ref={widthRef}
                  css={{ width: '100%', minWidth: 8, height: '100%' }}
                  onChange={(e) => handleChangeSize(e.target.value, 'width')}
                  value={size?.width || ''}
                />
              </div>
            </div>
            <div>
              <div css={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                {t('common.height', 'Height')}
              </div>
              <div
                css={{
                  border: '1px solid rgba(43,59,74,.3)',
                  height: 40,
                  padding: '0 12px',
                  width: 80,
                  borderRadius: 4,
                }}
              >
                <input
                  ref={heightRef}
                  css={{ width: '100%', minWidth: 8, height: '100%' }}
                  onChange={(e) => handleChangeSize(e.target.value, 'height')}
                  value={size?.height || ''}
                />
              </div>
            </div>
            <EditorButton
              disabled={isDisabledResize}
              onClick={() => setLockSizeAspect(!lockSiteAspect)}
              css={{ fontSize: 20, cursor: 'pointer', margin: '5px 0' }}
            >
              {lockSiteAspect ? <LockIcon /> : <LockOpenIcon />}
            </EditorButton>
          </div>
          {isDisabledResize && (
            <div css={{ color: '#db1436', fontSize: 12, marginTop: 5 }}>
              {t('header.dimensionsMustBeAtLeast', 'Dimensions must be at least 40px and no more than 8000px.')}
            </div>
          )}
          <div css={{ marginTop: 12 }}>
            <button
              css={{
                background: !isDisabledResize ? '#3a3a4c' : '#8383A2',
                padding: '8px 14px',
                lineHeight: 1,
                color: '#FFF',
                borderRadius: 4,
                cursor: !isDisabledResize ? 'pointer' : 'not-allowed',
                fontSize: 16,
                textAlign: 'center',
                fontWeight: 700,
                width: '100%',
              }}
              onClick={handleResize}
              disabled={isDisabledResize}
            >
              {isCreating ? t('header.createNewDesign', 'Create new design') : t('common.resize', 'Resize')}
            </button>
          </div>
        </div>
      </QuickBoxDialog>
      {openPreview && <PreviewModal onClose={() => setOpenPreview(false)} />}
    </>
  );
};

export default HeaderFileMenu;
