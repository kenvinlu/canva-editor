import React, { useRef, useState } from 'react';
import SettingButton from './SettingButton';
import Popover from 'canva-editor/components/popover/Popover';
import Slider from 'canva-editor/components/slider/Slider';
import { useEditor } from 'canva-editor/hooks';
import GridViewIcon from 'canva-editor/icons/GridViewIcon';
import CheckIcon from 'canva-editor/icons/CheckIcon';
import EditorButton from 'canva-editor/components/EditorButton';
import NotesIcon from 'canva-editor/icons/NotesIcon';
import GithubIcon from 'canva-editor/icons/GithubIcon';
import GumroadIcon from 'canva-editor/icons/GumroadIcon';

const PageControl = () => {
  const labelScaleOptionRef = useRef<HTMLDivElement>(null);
  const [openScaleOptions, setOpenScaleOptions] = useState(false);
  const { actions, activePage, totalPages, scale, isOpenPageSettings, isOpenNotes } =
    useEditor((state) => ({
      activePage: state.activePage,
      totalPages: state.pages.length,
      scale: state.scale,
      isOpenPageSettings: state.openPageSettings,
      isOpenNotes: state.sideBarTab === 'Notes'
    }));

  const handleChangeScale = (value: number) => {
    actions.setScale(value / 100);
  };
  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        fontWeight: 700,
        zIndex: 999
      }}
    >
      <div css={{ flexGrow: 1 }}>
        <EditorButton
          isActive={isOpenNotes}
          onClick={() => {
            actions.setSidebar();
            actions.setSidebarTab(isOpenNotes ? null : 'Notes');
          }}
        >
          <NotesIcon />
          <span css={{ padding: '0 4px' }}>Notes</span>
        </EditorButton>
      </div>

      <div
        css={{
          flexShrink: 0,
          display: 'grid',
          gridAutoFlow: 'column',
          gridColumnGap: 8,
          alignItems: 'center',
        }}
      >
        <div css={{ flexGrow: 1 }}>
          Page {activePage + 1} / {totalPages}
        </div>
        <div
          css={{
            height: 24,
            width: `1px`,
            background: 'rgba(57,76,96,.15)',
            margin: '0 8px',
          }}
        />
        <div css={{ width: 200, paddingRight: 8 }}>
          <Slider
            hideInput={true}
            hideLabel={true}
            value={scale * 100}
            min={10}
            max={500}
            disabled={isOpenPageSettings}
            onChange={handleChangeScale}
          />
        </div>
        <SettingButton
          ref={labelScaleOptionRef}
          tooltip='Zoom'
          onClick={() => setOpenScaleOptions(true)}
        >
          <div css={{ width: 48, textAlign: 'center' }}>
            {Math.round(scale * 100)}%
          </div>
        </SettingButton>
        <Popover
          open={openScaleOptions}
          anchorEl={labelScaleOptionRef.current}
          placement={'top-end'}
          onClose={() => setOpenScaleOptions(false)}
        >
          <div css={{ padding: '8px 0' }}>
            {[400, 500, 300, 200, 150, 100, 75, 50, 25, 10].map((s) => (
              <div
                key={s}
                css={{
                  padding: '0 8px',
                  display: 'flex',
                  height: 40,
                  alignItems: 'center',
                  cursor: 'pointer',
                  ':hover': {
                    backgroundColor: 'rgba(64,87,109,.07)',
                  },
                }}
                onClick={() => {
                  actions.setScale(s / 100);
                  setOpenScaleOptions(false);
                }}
              >
                <span
                  css={{ padding: '0 8px', whiteSpace: 'nowrap', flexGrow: 1 }}
                >
                  {s}%
                </span>
                {s / 100 === scale && <CheckIcon />}
              </div>
            ))}
          </div>
        </Popover>
        <EditorButton
          isActive={isOpenPageSettings}
          tooltip='Grid view'
          onClick={() => {
            actions.togglePageSettings();
          }}
        >
          <GridViewIcon />
        </EditorButton>
        <EditorButton
          tooltip='Source code'
          onClick={() => {
            actions.goToGithubPage();
          }}
        >
          <GithubIcon />
        </EditorButton>
        <EditorButton
          tooltip='Get full source code - Discount code CA2024'
          onClick={() => {
            actions.goToGumroadPage();
          }}
        >
          <GumroadIcon />
        </EditorButton>
      </div>
    </div>
  );
};

export default PageControl;
