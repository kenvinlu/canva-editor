import React, { forwardRef, ForwardRefRenderFunction, Fragment, useCallback, useEffect, useState } from 'react';
import { useEditor, useSelectedLayers } from '../../../hooks';
import { ImageLayerProps } from '../../ImageLayer';
import { cloneDeep } from 'lodash';
import SubMenu from './SubMenu';
import { useForwardedRef } from '../../../hooks/useForwardedRef';
import { RootLayerProps } from '../../RootLayer';
import ContextMenuItem from './ContextMenuItem';
import { getTransformStyle } from 'canva-editor/layers';
import { isGroupLayer } from 'canva-editor/utils/layer/layers';
import { copy } from 'canva-editor/utils/menu/actions/copy';
import { duplicate } from 'canva-editor/utils/menu/actions/duplicate';
import { paste } from 'canva-editor/utils/menu/actions/paste';

// Icons
import ArrowLeftIcon from 'canva-editor/icons/ArrowLeftIcon';
import TrashIcon from 'canva-editor/icons/TrashIcon';
import DuplicateIcon from 'canva-editor/icons/DuplicateIcon';
import LockIcon from 'canva-editor/icons/LockIcon';
import GroupingIcon from 'canva-editor/icons/GroupingIcon';
import ClipboardIcon from 'canva-editor/icons/ClipboardIcon';
import BringForwardIcon from 'canva-editor/icons/BringForwardIcon';
import BringToFontIcon from 'canva-editor/icons/BringToFontIcon';
import SendBackwardIcon from 'canva-editor/icons/SendBackwardIcon';
import SendToBackIcon from 'canva-editor/icons/SendToBackIcon';
import LayersIcon from 'canva-editor/icons/LayersIcon';
import UngroupIcon from 'canva-editor/icons/UngroupIcon';
import CopyIcon from 'canva-editor/icons/CopyIcon';
import AlignLeftIcon from 'canva-editor/icons/AlignLeftIcon';
import AlignCenterHorizontalIcon from 'canva-editor/icons/AlignCenterHorizontalIcon';
import AlignRightIcon from 'canva-editor/icons/AlignRightIcon';
import AlignTopIcon from 'canva-editor/icons/AlignTopIcon';
import AlignCenterVerticalIcon from 'canva-editor/icons/AlignCenterVerticalIcon';
import AlignBottomIcon from 'canva-editor/icons/AlignBottomIcon';
import BackgroundSelectionIcon from 'canva-editor/icons/BackgroundSelectionIcon';

const LayerContextMenu: ForwardRefRenderFunction<HTMLDivElement> = (_, ref) => {
    const { selectedLayerIds, selectedLayers } = useSelectedLayers();
    const menuRef = useForwardedRef<HTMLDivElement>(ref);
    const [offset, setOffset] = useState<{ x: number; y: number }>({ x: -9999, y: -9999 });
    const { state, openMenu, actions, pageIndex, pageSize, rootLayer } = useEditor((state) => ({
        openMenu: state.openMenu,
        pageIndex: state.activePage,
        pageSize: state.pageSize,
        rootLayer: state.pages[state.activePage] && state.pages[state.activePage].layers.ROOT,
    }));
    const imageLayer = selectedLayers.find((l) => l.data.type === 'Image');
    const handleCopy = async () => {
        await copy(state, { pageIndex, layerIds: selectedLayerIds });
        actions.hideContextMenu();
    };
    const handlePaste = useCallback(async () => {
        await paste({ actions });
        actions.hideContextMenu();
    }, [actions, pageIndex]);
    const handleDuplicate = () => {
        duplicate(state, { pageIndex, layerIds: selectedLayerIds, actions });
        actions.hideContextMenu();
    };
    const handleDelete = useCallback(() => {
        if (!selectedLayerIds.includes('ROOT')) {
            actions.deleteLayer(pageIndex, selectedLayerIds);
            actions.hideContextMenu();
        }
    }, [actions, selectedLayerIds]);
    const handleLock = () => {
        actions.lock(pageIndex, selectedLayerIds);
        actions.hideContextMenu();
    };
    const handleSetAsBackground = () => {
        if (imageLayer) {
            const ratio = pageSize.width / pageSize.height;
            const image = (imageLayer.data.props as ImageLayerProps).image;
            const imageRatio = image.boxSize.width / image.boxSize.height;
            const background = { ...cloneDeep(image), rotate: 0 };
            if (ratio > imageRatio) {
                background.boxSize.width = pageSize.width;
                background.boxSize.height = pageSize.width / imageRatio;
                background.position.y = (background.boxSize.height - pageSize.height) / -2;
                background.position.x = 0;
            } else {
                background.boxSize.height = pageSize.height;
                background.boxSize.width = pageSize.height * imageRatio;
                background.position.x = (background.boxSize.width - pageSize.width) / -2;
                background.position.y = 0;
            }
            actions.setProp<RootLayerProps>(pageIndex, 'ROOT', {
                image: background,
            });
            actions.history.merge().deleteLayer(pageIndex, imageLayer.id);
        }
        actions.hideContextMenu();
    };

    const handleSetAsImageLayer = () => {
        if (rootLayer) {
            const rootProps = rootLayer.data.props as RootLayerProps;
            const image = rootProps.image;
            if (image) {
                const ratio = pageSize.width / pageSize.height;
                const imageRatio = image.boxSize.width / image.boxSize.height;
                const imageSize = { boxSize: { width: 0, height: 0 } };
                if (ratio < imageRatio) {
                    imageSize.boxSize.width = pageSize.width * 0.8;
                    imageSize.boxSize.height = imageSize.boxSize.width / imageRatio;
                } else {
                    imageSize.boxSize.height = pageSize.height * 0.8;
                    imageSize.boxSize.width = imageSize.boxSize.height * imageRatio;
                }
                actions.addImageLayer({ url: image.url, thumb: "" }, imageSize.boxSize);
                actions.history.merge().setProp<RootLayerProps>(pageIndex, 'ROOT', {
                    image: null,
                });
                actions.hideContextMenu();
            }
        }
    };

    const backwardDisabled = rootLayer?.data.child.findIndex((i) => selectedLayerIds.includes(i)) === 0;
    const forwardDisabled =
        rootLayer?.data.child.findLastIndex((i) => selectedLayerIds.includes(i)) ===
        (rootLayer?.data.child.length || 0) - 1;
    const handleForward = () => {
        if (!forwardDisabled) {
            actions.bringForward(pageIndex, selectedLayerIds);
            actions.hideContextMenu();
        }
    };
    const handleToFront = () => {
        if (!forwardDisabled) {
            actions.bringToFront(pageIndex, selectedLayerIds);
            actions.hideContextMenu();
        }
    };
    const handleBackward = () => {
        if (!backwardDisabled) {
            actions.sendBackward(pageIndex, selectedLayerIds);
            actions.hideContextMenu();
        }
    };
    const handleToBack = () => {
        if (!backwardDisabled) {
            actions.sendToBack(pageIndex, selectedLayerIds);
            actions.hideContextMenu();
        }
    };
    const handleShowLayers = () => {
        actions.setSidebar('LAYER_MANAGEMENT');
        actions.hideContextMenu();
    };

    const handleAlign = (alignment: 'left' | 'right' | 'center' | 'top' | 'bottom' | 'middle') => {
        actions.setAlign(alignment);
        actions.hideContextMenu();
    };
    const handleUngroup = () => {
        if (selectedLayerIds.length === 1) {
            actions.ungroup(selectedLayerIds[0]);
        }
        actions.hideContextMenu();
    };

    const handleGroup = () => {
        actions.group(selectedLayerIds);
        actions.hideContextMenu();
    };
    useEffect(() => {
        const update = () => {
            const contentRect = menuRef.current?.getBoundingClientRect() as DOMRect;

            const offset = {
                x: -9999,
                y: -9999,
            };
            if (openMenu) {
                offset.x = 0;
                offset.y = 0;
                if (contentRect.width + openMenu.clientX > window.innerWidth) {
                    offset.x = -contentRect.width;
                }
                if (contentRect.height + openMenu.clientY > window.innerHeight) {
                    offset.y = window.innerHeight - contentRect.height - openMenu.clientY;
                }
            }
            setOffset(offset);
        };
        update();
        const hideMenu = () => {
            actions.hideContextMenu();
        };
        window.addEventListener('resize', hideMenu);
        return () => {
            window.removeEventListener('resize', hideMenu);
        };
    }, [menuRef, openMenu]);
    if (!openMenu) {
        return null;
    }
    const containerGroupLayer = !!selectedLayers.find((l) => isGroupLayer(l));

    return (
        <div
            ref={menuRef}
            css={{
                position: 'fixed',
                top: 0,
                left: 0,
                background: 'white',
                paddingTop: 8,
                paddingBottom: 8,
                borderRadius: 4,
                zIndex: 31,
                boxShadow: '0 0 0 1px rgba(64,87,109,.07),0 2px 12px rgba(53,71,90,.2)',
                transform: getTransformStyle({
                    position: {
                        x: openMenu.clientX + offset.x,
                        y: openMenu.clientY + offset.y,
                    },
                }),
                '@media (max-width: 900px)': {
                    bottom: 0,
                    top: 'auto',
                    transform: 'none',
                    display: 'flex',
                    right: 0,
                    padding: 0,
                },
            }}
        >
            <div
                css={{
                    display: 'none',
                    '@media (max-width: 900px)': {
                        flexShrink: 0,
                        fontSize: 24,
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: '#EBECF0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        margin: 16,
                    },
                }}
                onClick={() => actions.hideContextMenu()}
            >
                <ArrowLeftIcon />
            </div>
            <div
                css={{
                    '@media (max-width: 900px)': {
                        overflowX: 'auto',
                        flexGrow: 1,
                        padding: 16,
                        display: 'flex',
                    },
                }}
            >
                {!selectedLayerIds.includes('ROOT') && (
                    <ContextMenuItem name={'Copy'} icon={<CopyIcon />} shortcut={'Ctrl+C'} onClick={handleCopy} />
                )}
                {!selectedLayerIds.includes('ROOT') && (
                    <Fragment>
                        <ContextMenuItem
                            name={'Paste'}
                            icon={<ClipboardIcon />}
                            shortcut={'Ctrl+V'}
                            onClick={handlePaste}
                        />
                        <ContextMenuItem
                            name={'Duplicate'}
                            icon={<DuplicateIcon />}
                            shortcut={'Ctrl+D'}
                            onClick={handleDuplicate}
                        />
                        <ContextMenuItem
                            name={'Delete'}
                            icon={<TrashIcon />}
                            shortcut={'Delete'}
                            onClick={handleDelete}
                        />
                    </Fragment>
                )}

                {!selectedLayerIds.includes('ROOT') && (
                    <Fragment>
                        <div
                            css={{
                                marginTop: 8,
                                marginBottom: 8,
                                height: 1,
                                borderBottom: '1px solid rgba(57,76,96,.15)',
                                width: '100%',
                            }}
                        />
                        <ContextMenuItem name={'Layer'} icon={<LayersIcon />}>
                            <SubMenu
                                transform={{
                                    x: openMenu.clientX + offset.x,
                                    y: openMenu.clientY + offset.y,
                                }}
                            >
                                <ContextMenuItem
                                    name={'Bring Forward'}
                                    icon={<BringForwardIcon />}
                                    shortcut={'Ctrl+]'}
                                    disabled={forwardDisabled}
                                    onClick={handleForward}
                                />
                                <ContextMenuItem
                                    name={'Bring to Front'}
                                    icon={<BringToFontIcon />}
                                    shortcut={'Ctrl+Alt+]'}
                                    disabled={forwardDisabled}
                                    onClick={handleToFront}
                                />
                                <ContextMenuItem
                                    name={'Send Backward'}
                                    icon={<SendBackwardIcon />}
                                    shortcut={'Ctrl+['}
                                    disabled={backwardDisabled}
                                    onClick={handleBackward}
                                />
                                <ContextMenuItem
                                    name={'Send to Back'}
                                    icon={<SendToBackIcon />}
                                    shortcut={'Ctrl+Alt+['}
                                    disabled={backwardDisabled}
                                    onClick={handleToBack}
                                />
                                <ContextMenuItem
                                    name={'Show Layers'}
                                    icon={<LayersIcon />}
                                    onClick={handleShowLayers}
                                />
                            </SubMenu>
                        </ContextMenuItem>
                        <ContextMenuItem name={'Align'} icon={<AlignLeftIcon />}>
                            <SubMenu
                                transform={{
                                    x: openMenu.clientX + offset.x,
                                    y: openMenu.clientY + offset.y,
                                }}
                            >
                                <ContextMenuItem
                                    name={'Left'}
                                    icon={<AlignLeftIcon />}
                                    onClick={() => handleAlign('left')}
                                />
                                <ContextMenuItem
                                    name={'Center'}
                                    icon={<AlignCenterHorizontalIcon />}
                                    onClick={() => handleAlign('center')}
                                />
                                <ContextMenuItem
                                    name={'Right'}
                                    icon={<AlignRightIcon />}
                                    onClick={() => handleAlign('right')}
                                />
                                <ContextMenuItem
                                    name={'Top'}
                                    icon={<AlignTopIcon />}
                                    onClick={() => handleAlign('top')}
                                />
                                <ContextMenuItem
                                    name={'Middle'}
                                    icon={<AlignCenterVerticalIcon />}
                                    onClick={() => handleAlign('middle')}
                                />
                                <ContextMenuItem
                                    name={'Bottom'}
                                    icon={<AlignBottomIcon />}
                                    onClick={() => handleAlign('bottom')}
                                />
                            </SubMenu>
                        </ContextMenuItem>
                        <div
                            css={{
                                marginTop: 8,
                                marginBottom: 8,
                                height: 1,
                                borderBottom: '1px solid rgba(57,76,96,.15)',
                                width: '100%',
                            }}
                        />
                    </Fragment>
                )}

                {selectedLayerIds.length > 1 && (
                    <ContextMenuItem name={'Group'} icon={<GroupingIcon />} onClick={handleGroup} />
                )}
                {containerGroupLayer && (
                    <ContextMenuItem name={'Ungroup'} icon={<UngroupIcon />} onClick={handleUngroup} />
                )}
                {!selectedLayerIds.includes('ROOT') && (
                    <ContextMenuItem name={'Lock'} icon={<LockIcon />} onClick={handleLock} />
                )}
                {imageLayer && selectedLayerIds.length === 1 && (
                    <ContextMenuItem
                        name={'Set image as background'}
                        icon={<BackgroundSelectionIcon />}
                        onClick={handleSetAsBackground}
                    />
                )}
                {selectedLayerIds.length === 1 &&
                    selectedLayerIds.includes('ROOT') &&
                    (rootLayer?.data.props as RootLayerProps)?.image && (
                        <ContextMenuItem
                            name={'Detach image from background'}
                            icon={<BackgroundSelectionIcon />}
                            onClick={handleSetAsImageLayer}
                        />
                    )}
            </div>
        </div>
    );
};

export default forwardRef<HTMLDivElement>(LayerContextMenu);
