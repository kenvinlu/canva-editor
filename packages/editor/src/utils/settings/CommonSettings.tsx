import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import LayerSidebar from './sidebar/LayerSidebar';
import SettingButton from './SettingButton';
import Popover from 'canva-editor/components/popover/Popover';
import Slider from 'canva-editor/components/slider/Slider';
import { useSelectedLayers, useEditor } from 'canva-editor/hooks';
import { RootLayerProps } from 'canva-editor/layers/RootLayer';
import { isRootLayer } from '../layer/layers';
import LockIcon from 'canva-editor/icons/LockIcon';
import LockOpenIcon from 'canva-editor/icons/LockOpenIcon';
import TransparencyIcon from 'canva-editor/icons/TransparencyIcon';
import SettingDivider from './components/SettingDivider';
import useMobileDetect from 'canva-editor/hooks/useMobileDetect';

const CommonSettings = () => {
  const isMobile = useMobileDetect();
  const transparencyButtonRef = useRef<HTMLDivElement>(null);
  const [openTransparencySetting, setOpenTransparencySetting] = useState(false);
  const { selectedLayers, selectedLayerIds } = useSelectedLayers();
  const { actions, activePage, sidebar, pageSize, isPageLocked } = useEditor(
    (state) => ({
      activePage: state.activePage,
      sidebar: state.sidebar,
      pageSize: state.pageSize,
      isPageLocked:
        state.pages[state.activePage] &&
        state.pages[state.activePage].layers.ROOT.data.locked,
    })
  );
  const [size, setSize] = useState(pageSize);
  useEffect(() => {
    setSize(pageSize);
  }, [pageSize]);
  const { transparency } = useMemo(() => {
    return Object.entries(selectedLayers).reduce(
      (acc, [, layer]) => {
        if (isRootLayer(layer)) {
          acc.transparency = Math.max(
            acc.transparency,
            typeof layer.data.props.image?.transparency !== 'undefined'
              ? layer.data.props.image.transparency
              : 1
          );
        } else {
          acc.transparency = Math.max(
            acc.transparency,
            typeof layer.data.props.transparency !== 'undefined'
              ? layer.data.props.transparency
              : 1
          );
        }
        return acc;
      },
      { transparency: 0 }
    );
  }, [selectedLayers]);
  const isLocked = !!selectedLayers.find((l) => l.data.locked);
  const toggleLock = () => {
    if (isLocked) {
      actions.unlock(activePage, selectedLayerIds);
    } else {
      actions.lock(activePage, selectedLayerIds);
    }
  };
  const updateTransparency = (transparency: number) => {
    selectedLayerIds.forEach((layerId) => {
      if (layerId === 'ROOT') {
        actions.history
          .throttle(2000)
          .setProp<RootLayerProps>(activePage, layerId, {
            image: {
              transparency: transparency / 100,
            },
          });
      } else {
        actions.history.throttle(2000).setProp(activePage, layerId, {
          transparency: transparency / 100,
        });
      }
    });
  };
  useEffect(() => {
    setOpenTransparencySetting(false);
  }, [JSON.stringify(selectedLayerIds)]);

  return (
    <Fragment>
      <div
        css={{
          display: 'grid',
          alignItems: 'center',
          gridAutoFlow: 'column',
          gridGap: 8,
        }}
      >
        <SettingButton
          css={{ minWidth: 75 }}
          onClick={() => {
            actions.setSidebar('LAYER_MANAGEMENT');
          }}
        >
          <span css={{ padding: '0 4px' }}>Position</span>
        </SettingButton>

        {selectedLayerIds.length > 0 && !isLocked && !isPageLocked && (
          <Fragment>
            {(!isRootLayer(selectedLayers[0]) ||
              (isRootLayer(selectedLayers[0]) &&
                selectedLayers[0].data.props.image)) && (
              <Fragment>
                <SettingDivider />
                <SettingButton
                  ref={transparencyButtonRef}
                  css={{ fontSize: 20, minWidth: 30 }}
                  onClick={() => setOpenTransparencySetting(true)}
                >
                  <TransparencyIcon />
                </SettingButton>
                <Popover
                  open={openTransparencySetting}
                  anchorEl={transparencyButtonRef.current}
                  placement={isMobile ? 'top-end' : 'bottom-end'}
                  onClose={() => setOpenTransparencySetting(false)}
                  offsets={{
                    'bottom-end': { x: 0, y: 8 },
                  }}
                >
                  <div css={{ padding: 16 }}>
                    <Slider
                      label={'Transparency'}
                      defaultValue={transparency * 100}
                      onChange={updateTransparency}
                    />
                  </div>
                </Popover>
              </Fragment>
            )}
          </Fragment>
        )}

        {selectedLayerIds.length > 0 && (
          <>
            <SettingDivider />
            <SettingButton
              css={{ fontSize: 20 }}
              isActive={isLocked}
              onClick={toggleLock}
            >
              {isLocked && <LockIcon />}
              {!isLocked && <LockOpenIcon />}
            </SettingButton>
          </>
        )}
      </div>
      {sidebar === 'LAYER_MANAGEMENT' && <LayerSidebar open={true} />}
    </Fragment>
  );
};

export default CommonSettings;
