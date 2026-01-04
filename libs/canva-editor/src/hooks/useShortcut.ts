import { useCallback, useEffect } from 'react';
import { useEditor } from './useEditor';
import { keyName } from 'w3c-keyname';
import { useSelectedLayers } from './useSelectedLayers';
import { paste } from 'canva-editor/utils/menu/actions/paste';
import { modifiers, normalizeKeyName } from 'canva-editor/utils';
import { copy } from 'canva-editor/utils/menu/actions/copy';
import { duplicate } from 'canva-editor/utils/menu/actions/duplicate';

const useShortcut = (frameEle: HTMLElement | null) => {
  const { actions, state, activePage, rootLayer, scale, selectedLayers } =
    useEditor((state) => ({
      rootLayer:
        state.pages[state.activePage] &&
        state.pages[state.activePage].layers.ROOT,
      activePage: state.activePage,
      scale: state.scale,
      selectedLayers: state.selectedLayers,
    }));
  const { selectedLayerIds } = useSelectedLayers();
  const handlePaste = useCallback(async () => {
    await paste({ actions });
    actions.hideContextMenu();
  }, [actions]);
  const handleCopy = useCallback(async () => {
    await copy(state, { pageIndex: activePage, layerIds: selectedLayerIds });
    actions.hideContextMenu();
  }, [actions, state, activePage, copy, selectedLayerIds]);

  const handleDuplicate = useCallback(() => {
    duplicate(state, {
      pageIndex: activePage,
      layerIds: selectedLayerIds,
      actions,
    });
    actions.hideContextMenu();
  }, [state, activePage, selectedLayerIds]);

  const handleDelete = useCallback(() => {
    if (!selectedLayerIds.includes('ROOT')) {
      actions.deleteLayer(state.activePage, selectedLayerIds);
    }
  }, [selectedLayerIds, state, actions]);

  const backwardDisabled =
    rootLayer?.data.child.findIndex((i) => selectedLayerIds.includes(i)) === 0;
  const forwardDisabled =
    rootLayer?.data.child.findLastIndex((i) => selectedLayerIds.includes(i)) ===
    (rootLayer?.data.child.length || 0) - 1;
  const handleForward = () => {
    if (!forwardDisabled) {
      actions.bringForward(activePage, selectedLayerIds);
    }
  };
  const handleToFront = () => {
    if (!forwardDisabled) {
      actions.bringToFront(activePage, selectedLayerIds);
    }
  };
  const handleBackward = () => {
    if (!backwardDisabled) {
      actions.sendBackward(activePage, selectedLayerIds);
    }
  };
  const handleToBack = () => {
    if (!backwardDisabled) {
      actions.sendToBack(activePage, selectedLayerIds);
    }
  };
  const handleZoomIn = () => {
    if (scale >= 4) {
      actions.setScale(5);
    } else if (scale >= 3) {
      actions.setScale(4);
    } else if (scale >= 2) {
      actions.setScale(3);
    } else if (scale >= 1.5) {
      actions.setScale(2);
    } else if (scale >= 1.25) {
      actions.setScale(1.5);
    } else if (scale >= 1) {
      actions.setScale(1.25);
    } else if (scale >= 0.75) {
      actions.setScale(1);
    } else if (scale >= 0.5) {
      actions.setScale(0.75);
    } else if (scale >= 0.25) {
      actions.setScale(0.5);
    } else {
      actions.setScale(0.25);
    }
  };
  const handleZoomOut = () => {
    if (scale <= 0.25) {
      actions.setScale(0.1);
    } else if (scale <= 0.5) {
      actions.setScale(0.25);
    } else if (scale <= 0.75) {
      actions.setScale(0.5);
    } else if (scale <= 1) {
      actions.setScale(0.75);
    } else if (scale <= 1.25) {
      actions.setScale(1);
    } else if (scale <= 1.5) {
      actions.setScale(1.25);
    } else if (scale <= 2) {
      actions.setScale(1.5);
    } else if (scale <= 3) {
      actions.setScale(2);
    } else if (scale <= 4) {
      actions.setScale(3);
    } else {
      actions.setScale(4);
    }
  };
  const handleZoomReset = () => {
    actions.setScale(1);
  };
  const handleKeydown = useCallback(
    async (e: KeyboardEvent) => {
      const name = keyName(e);
      const key = modifiers(name, e);
      const isSelectedLayer = selectedLayerIds.length > 0;
      // Contain shortcut in blur mode
      switch (key) {
        case normalizeKeyName('Mod-a'):
          isSelectedLayer && actions.selectAllLayers();
          break;
        case normalizeKeyName('Mod-z'):
          actions.history.undo();
          e.preventDefault();
          break;
        case normalizeKeyName('Mod-y'):
          actions.history.redo();
          e.preventDefault();
          break;
        case normalizeKeyName('Mod-v'):
          await handlePaste();
          e.preventDefault();
          break;
        case normalizeKeyName('Mod-c'):
          isSelectedLayer && (await handleCopy());
          e.preventDefault();
          break;
        case normalizeKeyName('Mod-d'):
          isSelectedLayer && (await handleDuplicate());
          e.preventDefault();
          break;

        case normalizeKeyName('Mod-]'):
          isSelectedLayer && handleForward();
          e.preventDefault();
          break;
        case normalizeKeyName('Mod-Alt-]'):
          isSelectedLayer && handleToFront();
          e.preventDefault();
          break;
        case normalizeKeyName('Mod-['):
          isSelectedLayer && handleBackward();
          e.preventDefault();
          break;
        case normalizeKeyName('Mod-Alt-['):
          isSelectedLayer && handleToBack();
          e.preventDefault();
          break;
        case normalizeKeyName('Delete'):
        case normalizeKeyName('Backspace'):
          isSelectedLayer && handleDelete();
          break;
        case normalizeKeyName('ArrowLeft'):
          isSelectedLayer && actions.moveSelectedLayers('left', 1);
          break;
        case normalizeKeyName('ArrowRight'):
          isSelectedLayer && actions.moveSelectedLayers('right', 1);
          break;
        case normalizeKeyName('ArrowUp'):
          isSelectedLayer && actions.moveSelectedLayers('top', 1);
          break;
        case normalizeKeyName('ArrowDown'):
          isSelectedLayer && actions.moveSelectedLayers('bottom', 1);
          break;
        case normalizeKeyName('Mod-0'):
          handleZoomReset();
          e.preventDefault();
          break;
        case normalizeKeyName('Mod--'):
          handleZoomOut();
          e.preventDefault();
          break;
        case normalizeKeyName('Mod-='):
          handleZoomIn();
          e.preventDefault();
          break;
        case normalizeKeyName('Mod-h'):
          actions.goToGithubPage();
          e.preventDefault();
          break;
      }
    },
    [actions, handleCopy, handlePaste, handleDuplicate, handleDelete]
  );

  const zoomStep = 0.02;
  
  useEffect(() => {
    let animationFrameId: number;

    const handleZoomDesktop = (e: WheelEvent) => {
      if (e.ctrlKey && frameEle) {
        e.preventDefault();

        // Apply zoom
        const s = Math.exp((-e.deltaY * zoomStep) / 3);
        const newScale = +Math.min(Math.max(scale * s, 0.1), 5);
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(() => {
          actions.setScale(newScale);
        });
      }
    };

    if (frameEle) {
      frameEle?.addEventListener('wheel', handleZoomDesktop, {
        passive: false,
      });
    }
    return () => {
      if (frameEle) {
        frameEle?.removeEventListener('wheel', handleZoomDesktop);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [frameEle, scale]);

  useEffect(() => {
    frameEle?.addEventListener('keydown', handleKeydown);
    return () => {
      frameEle?.removeEventListener('keydown', handleKeydown);
    };
  }, [frameEle, handleKeydown]);
};

export default useShortcut;
