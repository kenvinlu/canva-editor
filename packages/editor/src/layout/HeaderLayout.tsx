import { forwardRef, ForwardRefRenderFunction, useState } from 'react';
import { useEditor } from 'canva-editor/hooks';
import CanvaIcon from 'canva-editor/icons/CanvaIcon';
import EditInlineInput from 'canva-editor/components/EditInlineInput';
import SettingDivider from 'canva-editor/utils/settings/components/SettingDivider';
import EditorButton from 'canva-editor/components/EditorButton';
import NextIcon from 'canva-editor/icons/NextIcon';
import BackIcon from 'canva-editor/icons/BackIcon';
import SyncedIcon from 'canva-editor/icons/SyncedIcon';
import HeaderFileMenu from './sidebar/components/HeaderFileMenu';
import SyncingIcon from 'canva-editor/icons/SyncingIcon';
import useMobileDetect from 'canva-editor/hooks/useMobileDetect';
import styled from '@emotion/styled';
import ExportIcon from 'canva-editor/icons/ExportIcon';

const Button = styled('button')`
  display: flex;
  align-items: center;
  color: #fff;
  line-height: 1;
  background: rgb(255 255 255 / 7%);
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: rgb(255 255 255 / 15%);
  }
`;

interface HeaderLayoutProps {
  logoUrl?: string;
  designName: string;
  saving: boolean;
  onChanges: (str: string) => void;
}
const HeaderLayout: ForwardRefRenderFunction<
  HTMLDivElement,
  HeaderLayoutProps
> = ({ logoUrl, designName, saving, onChanges }, ref) => {
  const [name, setName] = useState(designName);
  const { actions, query } = useEditor();
  const isMobile = useMobileDetect();
  return (
    <div
      ref={ref}
      css={{
        background: '#893a3a',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 31,
        '@media (max-width: 900px)': {
          padding: 12,
        },
      }}
    >
      {!isMobile && (
        <div
          css={{
            fontSize: 36,
          }}
        >
            <img
              src={logoUrl || '/logo.svg'}
              css={{
                height: 40,
              }}
            />
        </div>
      )}
      <div css={{ marginRight: 'auto' }}>
        <div css={{ margin: isMobile ? '0 16px 0 0' : '0 16px' }}>
          <HeaderFileMenu designName={name} />
        </div>
      </div>
      <div
        css={{ display: 'flex', alignItems: 'center', verticalAlign: 'middle' }}
      >
        <div css={{ display: 'flex', alignItems: 'center', columnGap: 15 }}>
          <EditInlineInput
            text={name}
            placeholder='Untitled design'
            autoRow={false}
            styles={{
              placeholderColor: 'hsla(0,0%,100%,.5)',
            }}
            onSetText={(newText) => {
              setName(newText);
              if (name !== newText) {
                onChanges(newText);
                actions.setName(newText);
              }
            }}
            handleStyle={(isFocus) => {
              return {
                color: '#fff',
                borderRadius: 6,
                padding: 8,
                minHeight: 18,
                minWidth: 18,
                border: `1px solid ${
                  isFocus ? 'hsla(0,0%,100%,.8)' : 'transparent'
                }`,
                ':hover': {
                  border: '1px solid hsla(0,0%,100%,.8)',
                },
              };
            }}
            inputCss={{
              borderBottomColor: 'transparent',
              backgroundColor: 'transparent',
            }}
          />
          <div css={{ color: 'hsla(0,0%,100%,.7)' }}>
            {saving ? <SyncingIcon /> : <SyncedIcon />}
          </div>
        </div>
        <div
          css={{
            margin: '0 16px',
          }}
        >
          <SettingDivider background='hsla(0,0%,100%,.15)' />
        </div>
        <div css={{ display: 'flex', columnGap: 15 }}>
          <EditorButton
            onClick={actions.history.undo}
            disabled={!query.history.canUndo()}
            styles={{
              disabledColor: 'hsla(0,0%,100%,.4)',
              color: '#fff',
            }}
            tooltip='Undo'
          >
            <BackIcon />
          </EditorButton>
          <EditorButton
            onClick={actions.history.redo}
            disabled={!query.history.canRedo()}
            styles={{
              disabledColor: 'hsla(0,0%,100%,.4)',
              color: '#fff',
            }}
            tooltip='Redo'
          >
            <NextIcon />
          </EditorButton>
        </div>
        {!isMobile && (
          <>
            <div
              css={{
                margin: '0 16px',
              }}
            >
              <SettingDivider background='hsla(0,0%,100%,.15)' />
            </div>
            <Button onClick={() => {
              actions.fireDownloadPNGCmd(0);
            }}>
              <div css={{ fontSize: 20 }}>
                <ExportIcon />
              </div>{' '}
              <span css={{ marginRight: 4, marginLeft: 4 }}>Export</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default forwardRef(HeaderLayout);
