import React, {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Tooltip as ReactTooltip } from 'canva-editor/tooltip';
import FontSidebar from './sidebar/FontSidebar';
import TextEffectSidebar from './sidebar/TextEffectSidebar';
import ColorSidebar from './sidebar/ColorSidebar';
import { filter, isEqual, throttle, uniq, uniqBy } from 'lodash';
import Popover from 'canva-editor/components/popover/Popover';
import Slider from 'canva-editor/components/slider/Slider';
import {
  unsetBoldOfBlock,
  toggleBold,
  setBold,
  unsetBold,
} from 'canva-editor/components/text-editor/core/command/bold';
import {
  unsetItalicOfBlock,
  toggleItalic,
  setItalic,
  unsetItalic,
} from 'canva-editor/components/text-editor/core/command/italic';
import { selectAll } from 'canva-editor/components/text-editor/core/command/selectAll';
import { selectNode } from 'canva-editor/components/text-editor/core/command/selectNode';
import { selectText } from 'canva-editor/components/text-editor/core/command/selectText';
import { setBulletList } from 'canva-editor/components/text-editor/core/command/setBulletList';
import { setFontFamily } from 'canva-editor/components/text-editor/core/command/setFontFamily';
import { setFontSize } from 'canva-editor/components/text-editor/core/command/setFontSize';
import { setLetterSpacing } from 'canva-editor/components/text-editor/core/command/setLetterSpacing';
import { setLineHeight } from 'canva-editor/components/text-editor/core/command/setLineHeight';
import { setOrderedList } from 'canva-editor/components/text-editor/core/command/setOrderedList';
import { setTextAlign } from 'canva-editor/components/text-editor/core/command/setTextAlign';
import { setTextTransform } from 'canva-editor/components/text-editor/core/command/setTextTransform';
import {
  setColorForBlock,
  setColor,
} from 'canva-editor/components/text-editor/core/command/textColor';
import {
  toggleUnderline,
  setUnderline,
  unsetUnderline,
} from 'canva-editor/components/text-editor/core/command/underline';
import { isActive } from 'canva-editor/components/text-editor/core/helper/isActive';
import { isEmptyContent } from 'canva-editor/components/text-editor/core/helper/isEmptyContent';
import {
  getAllAttrs,
  getFontFamily,
  getFontSize,
  getLineHeight,
  getLetterSpacing,
  getColor,
  getAllMarks,
  getAttrs,
  getMarkAttrs,
} from 'canva-editor/components/text-editor/mark';
import { useSelectedLayers, useEditor } from 'canva-editor/hooks';
import { useUsedFont } from 'canva-editor/hooks/useUsedFont';
import { getTransformStyle } from 'canva-editor/layers';
import { TextLayerProps } from 'canva-editor/layers/TextLayer';
import {
  Layer,
  LayerId,
  FontData,
  FontStyle,
  LayerComponentProps,
} from 'canva-editor/types';
import { getPositionChangesBetweenTwoCorners } from '../2d/getPositionChangesBetweenTwoCorners';
import { visualCorners } from '../2d/visualCorners';
import { getVirtualDomHeight } from '../dom/getVirtualDomHeight';
import { getControlBoxSizeFromLayers } from '../layer/getControlBoxSizeFromLayers';
import { ColorParser } from '../../color-picker/utils';
import SettingButton from './SettingButton';

// Icons
import CheckIcon from 'canva-editor/icons/CheckIcon';
import PlusIcon from 'canva-editor/icons/PlusIcon';
import ArrowDownIcon from 'canva-editor/icons/ArrowDownIcon';
import MinusIcon from 'canva-editor/icons/MinusIcon';
import FormatBoldIcon from 'canva-editor/icons/FormatBoldIcon';
import FormatItalicIcon from 'canva-editor/icons/FormatItalicIcon';
import FormatUnderlineIcon from 'canva-editor/icons/FormatUnderlineIcon';
import FormatUppercaseIcon from 'canva-editor/icons/FormatUppercaseIcon';
import TextAlignLeftIcon from 'canva-editor/icons/TextAlignLeftIcon';
import TextAlignCenterIcon from 'canva-editor/icons/TextAlignCenterIcon';
import TextAlignRightIcon from 'canva-editor/icons/TextAlignRightIcon';
import TextAlignJustifyIcon from 'canva-editor/icons/TextAlignJustifyIcon';
import TextAUnderlineIcon from 'canva-editor/icons/TextAUnderlineIcon';
import ListBulletsIcon from 'canva-editor/icons/ListBulletsIcon';
import ListNumbersIcon from 'canva-editor/icons/ListNumbersIcon';
import LineSpacingIcon from 'canva-editor/icons/LineSpacingIcon';
import useMobileDetect from 'canva-editor/hooks/useMobileDetect';

interface TextSettingsProps {
  layers: Layer<TextLayerProps>[];
}

const fontSizeList = [
  6, 8, 10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 48, 56, 64, 72, 80, 88, 96,
  104, 120, 144,
];
const TextSettings: FC<TextSettingsProps> = ({ layers }) => {
  const isMobile = useMobileDetect();
  const fontSizeRef = useRef<HTMLDivElement>(null);
  const fontSizeInputRef = useRef<HTMLInputElement>(null);
  const spacingRef = useRef<HTMLDivElement>(null);
  const [openSpacingSetting, setOpenSpacingSetting] = useState(false);
  const { selectedLayers, selectedLayerIds } = useSelectedLayers();
  const [openFontSizeSelection, setOpenFontSizeSelection] = useState(false);
  const { usedFonts } = useUsedFont();
  const [
    {
      isBold,
      isItalic,
      isUnderline,
      isUppercase,
      isBulletList,
      isOrderedList,
      isAlignLeft,
      isAlignRight,
      isAlignCenter,
      isAlignJustify,
      ...settings
    },
    setSettings,
  ] = useState(() => {
    const settings: {
      fontFamily: Record<LayerId, FontData[]>;
      fontSize: Record<LayerId, number[]>;
      color: Record<LayerId, string[]>;
      isBold: boolean;
      isItalic: boolean;
      isUnderline: boolean;
      isUppercase: boolean;
      isBulletList: boolean;
      isOrderedList: boolean;
      isAlignLeft: boolean;
      isAlignRight: boolean;
      isAlignCenter: boolean;
      isAlignJustify: boolean;
      lineHeight: Record<LayerId, number[]>;
      letterSpacing: Record<LayerId, number[]>;
    } = {
      fontFamily: {},
      fontSize: {},
      color: {},
      isBold: true,
      isItalic: true,
      isUnderline: true,
      isUppercase: true,
      isBulletList: true,
      isOrderedList: true,
      isAlignLeft: true,
      isAlignRight: true,
      isAlignCenter: true,
      isAlignJustify: true,
      lineHeight: {},
      letterSpacing: {},
    };
    layers.forEach((layer) => {
      settings.fontFamily[layer.id] = layer.data.props.fonts;
      settings.fontSize[layer.id] = layer.data.props.fontSizes;
      settings.color[layer.id] = layer.data.props.colors;
      const editor = layer.data.editor;
      if (editor) {
        if (!isActive(editor.state, 'bold')) {
          settings.isBold = false;
        }
        if (!isActive(editor.state, 'italic')) {
          settings.isItalic = false;
        }
        if (!isActive(editor.state, 'underline')) {
          settings.isUnderline = false;
        }
        if (!isActive(editor.state, null, { indent: 1, listType: '' })) {
          settings.isBulletList = false;
        }
        if (!isActive(editor.state, null, { indent: 1, listType: 'ordered' })) {
          settings.isOrderedList = false;
        }
        if (!isActive(editor.state, null, { textTransform: 'uppercase' })) {
          settings.isUppercase = false;
        }
        if (!isActive(editor.state, null, { textAlign: 'left' })) {
          settings.isAlignLeft = false;
        }
        if (!isActive(editor.state, null, { textAlign: 'right' })) {
          settings.isAlignRight = false;
        }
        if (!isActive(editor.state, null, { textAlign: 'center' })) {
          settings.isAlignCenter = false;
        }
        if (!isActive(editor.state, null, { textAlign: 'justify' })) {
          settings.isAlignJustify = false;
        }
      }
    });
    return settings;
  });
  const { actions, activePage, textEditor, editingLayer, sidebar, fontList } =
    useEditor((state) => ({
      activePage: state.activePage,
      sidebar: state.sidebar,
      fontList: state.fontList,
      textEditor: state.textEditor,
      editingLayer: state.textEditor
        ? (state.pages[state.textEditor.pageIndex].layers[
            state.textEditor.layerId
          ] as unknown as Layer<TextLayerProps>)
        : null,
    }));
  const getUniqueFontFamily = (editorAttrs: Record<string, string[]>) =>
    uniqBy(
      getFontFamily(editorAttrs).map((font) => {
        const usedFont = usedFontObj[font] || fontObj[font];
        if (!usedFont) console.log('Font not found: ' + font);
        return {
          family: usedFont.family,
          name: usedFont.name,
          url: usedFont.url,
          style: usedFont.style,
          styles: filter(
            fontList,
            (f) => f.family === usedFont.family && f.name !== usedFont.name
          ),
        };
      }),
      'name'
    );

  useEffect(() => {
    const settings: {
      fontFamily: Record<LayerId, FontData[]>;
      fontSize: Record<LayerId, number[]>;
      color: Record<LayerId, string[]>;
      isBold: boolean;
      isItalic: boolean;
      isUnderline: boolean;
      isUppercase: boolean;
      isBulletList: boolean;
      isOrderedList: boolean;
      isAlignLeft: boolean;
      isAlignRight: boolean;
      isAlignCenter: boolean;
      isAlignJustify: boolean;
      lineHeight: Record<LayerId, number[]>;
      letterSpacing: Record<LayerId, number[]>;
    } = {
      fontFamily: {},
      fontSize: {},
      color: {},
      isBold: true,
      isItalic: true,
      isUnderline: true,
      isUppercase: true,
      isBulletList: true,
      isOrderedList: true,
      isAlignLeft: true,
      isAlignRight: true,
      isAlignCenter: true,
      isAlignJustify: true,
      lineHeight: {},
      letterSpacing: {},
    };
    setOpenSpacingSetting(false);
    setOpenFontSizeSelection(false);
    selectedLayers.forEach((layer) => {
      const editor = layer.data.editor;
      if (editor) {
        const attrs = getAllAttrs(editor.state.doc);
        settings.fontFamily[layer.id] = getUniqueFontFamily(attrs);
        settings.fontSize[layer.id] = getFontSize(attrs);
        settings.lineHeight[layer.id] = getLineHeight(attrs);
        settings.letterSpacing[layer.id] = getLetterSpacing(attrs);
        settings.color[layer.id] = getColor(
          attrs,
          getAllMarks(editor.state.doc)
        );
        if (!isActive(editor.state, 'bold')) {
          settings.isBold = false;
        }
        if (!isActive(editor.state, 'italic')) {
          settings.isItalic = false;
        }
        if (!isActive(editor.state, 'underline')) {
          settings.isUnderline = false;
        }
        if (!isActive(editor.state, null, { indent: 1, listType: '' })) {
          settings.isBulletList = false;
        }
        if (!isActive(editor.state, null, { indent: 1, listType: 'ordered' })) {
          settings.isOrderedList = false;
        }
        if (!isActive(editor.state, null, { textTransform: 'uppercase' })) {
          settings.isUppercase = false;
        }
        if (!isActive(editor.state, null, { textAlign: 'left' })) {
          settings.isAlignLeft = false;
        }
        if (!isActive(editor.state, null, { textAlign: 'right' })) {
          settings.isAlignRight = false;
        }
        if (!isActive(editor.state, null, { textAlign: 'center' })) {
          settings.isAlignCenter = false;
        }
        if (!isActive(editor.state, null, { textAlign: 'justify' })) {
          settings.isAlignJustify = false;
        }
        setSettings(settings);
      }
    });
  }, [JSON.stringify(selectedLayerIds)]);
  const { fontFamily, fontSize, color, lineHeight, letterSpacing } =
    useMemo(() => {
      return layers.reduce(
        (acc, layer) => {
          if (settings.fontFamily[layer.id]) {
            const props = layer.data.props;
            acc.fontFamily.push(...settings.fontFamily[layer.id]);
            acc.fontFamily = uniqBy(acc.fontFamily, 'name');
            if (settings.fontSize[layer.id]) {
              acc.fontSize = uniq(
                acc.fontSize.concat(
                  settings.fontSize[layer.id].map(
                    (s) => Math.round(s * props.scale * 10) / 10
                  )
                )
              );
            }
            acc.color = uniq(acc.color.concat(settings.color[layer.id]));
            acc.lineHeight = uniq(
              acc.lineHeight.concat(settings.lineHeight[layer.id])
            );
            acc.letterSpacing = uniq(
              acc.letterSpacing.concat(settings.letterSpacing[layer.id])
            );
          }
          return acc;
        },
        {
          fontSize: [],
          fontFamily: [],
          color: [],
          lineHeight: [],
          letterSpacing: [],
        } as {
          fontSize: number[];
          fontFamily: FontData[];
          color: string[];
          lineHeight: number[];
          letterSpacing: number[];
        }
      );
    }, [settings, selectedLayers]);

  useEffect(() => {
    if (fontSizeInputRef.current) {
      if (fontSize.length === 1) {
        fontSizeInputRef.current.value = fontSize[0] + '';
      } else {
        fontSizeInputRef.current.value = '--';
      }
    }
  }, [fontSize]);
  const fontObj = useMemo(() => {
    return fontList.reduce((acc, font) => {
      acc[font.name] = font;
      return acc;
    }, {} as Record<string, FontData>);
  }, [fontList]);
  const usedFontObj = useMemo(() => {
    return usedFonts.reduce((acc, font) => {
      acc[font.name] = font;
      return acc;
    }, {} as Record<string, FontData>);
  }, [usedFonts]);

  const updateLayerProps = useCallback(
    (type: 'content' | 'selection') => {
      // function is called twice because it updates editor
      const settings: {
        fontFamily: Record<LayerId, FontData[]>;
        fontSize: Record<LayerId, number[]>;
        color: Record<LayerId, string[]>;
        isBold: boolean;
        isItalic: boolean;
        isUnderline: boolean;
        isUppercase: boolean;
        isBulletList: boolean;
        isOrderedList: boolean;
        isAlignLeft: boolean;
        isAlignRight: boolean;
        isAlignCenter: boolean;
        isAlignJustify: boolean;
        lineHeight: Record<LayerId, number[]>;
        letterSpacing: Record<LayerId, number[]>;
      } = {
        fontFamily: {},
        fontSize: {},
        color: {},
        isBold: true,
        isItalic: true,
        isUnderline: true,
        isUppercase: true,
        isBulletList: true,
        isOrderedList: true,
        isAlignLeft: true,
        isAlignRight: true,
        isAlignCenter: true,
        isAlignJustify: true,
        lineHeight: {},
        letterSpacing: {},
      };
      if (editingLayer) {
        settings.fontFamily[editingLayer.id] = [];
        settings.fontSize[editingLayer.id] = [];
        settings.color[editingLayer.id] = [];
        settings.lineHeight[editingLayer.id] = [];
        settings.letterSpacing[editingLayer.id] = [];
        const editor = textEditor?.editor;
        if (editor) {
          const props = editingLayer.data.props;
          if (isEmptyContent(editor.state)) {
            setColorForBlock(props.colors[0])(editor.state, editor.dispatch);
            setFontSize(props.fontSizes[0])(editor.state, editor.dispatch);
            setFontFamily(props.fonts[0].name)(editor.state, editor.dispatch);
            editor.focus();
          }
          const matrix = new WebKitCSSMatrix(
            getTransformStyle({
              position: editingLayer.data.props.position,
              rotate: editingLayer.data.props.rotate,
            })
          );

          const oldCorners = visualCorners(
            editingLayer.data.props.boxSize,
            matrix,
            editingLayer.data.props.position
          );
          const newCorners = visualCorners(
            {
              width: editingLayer.data.props.boxSize.width,
              height: editor.dom.clientHeight * editingLayer.data.props.scale,
            },
            matrix,
            editingLayer.data.props.position
          );
          const { changeX, changeY } = getPositionChangesBetweenTwoCorners(
            oldCorners,
            newCorners,
            'bottomRight'
          );

          if (editor.state.selection.empty) {
            const markList =
              editor.state.storedMarks || editor.state.selection.$from.marks();
            const markAttrs = markList.reduce((acc, mark) => {
              Object.entries(mark.attrs).forEach(([key, value]) => {
                if (!acc[key]) {
                  acc[key] = [];
                }
                acc[key].push(value);
              });
              return acc;
            }, {} as Record<string, string[]>);
            settings.color[editingLayer.id] = uniq(getColor({}, markAttrs));
          }
          let blockColor: string[] | null = null;
          editor.state.doc.nodesBetween(
            editor.state.selection.ranges[0].$from.pos,
            editor.state.selection.ranges[0].$to.pos,
            (node) => {
              const attrs = getAttrs(node);
              if (node.isBlock) {
                const fontFamily = getUniqueFontFamily(attrs);
                settings.fontFamily[editingLayer.id].push(...fontFamily);
                settings.fontFamily[editingLayer.id] = uniqBy(
                  settings.fontFamily[editingLayer.id],
                  'name'
                );
                settings.fontSize[editingLayer.id] = uniq(
                  settings.fontSize[editingLayer.id].concat(getFontSize(attrs))
                );
                settings.lineHeight[editingLayer.id] = uniq(
                  settings.lineHeight[editingLayer.id].concat(
                    getLineHeight(attrs)
                  )
                );
                settings.letterSpacing[editingLayer.id] = uniq(
                  settings.letterSpacing[editingLayer.id].concat(
                    getLetterSpacing(attrs)
                  )
                );
                blockColor = getColor(attrs, getMarkAttrs(node));
              }
              if (node.isText && !editor.state.selection.empty) {
                let colors = getColor(attrs, getMarkAttrs(node));
                if (colors.length === 0 && blockColor) {
                  colors = blockColor;
                }
                settings.color[editingLayer.id] = uniq(
                  settings.color[editingLayer.id].concat(colors)
                );
                blockColor = null;
              }
            }
          );
          if (!isActive(editor.state, 'bold')) {
            settings.isBold = false;
          }
          if (!isActive(editor.state, 'italic')) {
            settings.isItalic = false;
          }
          if (!isActive(editor.state, 'underline')) {
            settings.isUnderline = false;
          }
          if (!isActive(editor.state, null, { indent: 1, listType: '' })) {
            settings.isBulletList = false;
          }
          if (
            !isActive(editor.state, null, { indent: 1, listType: 'ordered' })
          ) {
            settings.isOrderedList = false;
          }
          if (!isActive(editor.state, null, { textTransform: 'uppercase' })) {
            settings.isUppercase = false;
          }
          if (!isActive(editor.state, null, { textAlign: 'left' })) {
            settings.isAlignLeft = false;
          }
          if (!isActive(editor.state, null, { textAlign: 'right' })) {
            settings.isAlignRight = false;
          }
          if (!isActive(editor.state, null, { textAlign: 'center' })) {
            settings.isAlignCenter = false;
          }
          if (!isActive(editor.state, null, { textAlign: 'justify' })) {
            settings.isAlignJustify = false;
          }
          setSettings(settings);
          if (type === 'content') {
            const attrs = getAllAttrs(editor.state.doc);
            actions.history
              .merge()
              .setProp<TextLayerProps>(activePage, editingLayer.id, {
                text: editor.dom.innerHTML,
                fontSizes: getFontSize(attrs),
                fonts: getUniqueFontFamily(attrs),
                colors: getColor(attrs, getAllMarks(editor.state.doc)),
                boxSize: {
                  width: props.boxSize.width,
                  height: editor.dom.clientHeight * props.scale,
                },
                position: {
                  x: props.position.x - changeX,
                  y: props.position.y - changeY,
                },
              });
            actions.setControlBox({
              boxSize: {
                width: props.boxSize.width,
                height: editor.dom.clientHeight * props.scale,
              },
              position: {
                x: props.position.x - changeX,
                y: props.position.y - changeY,
              },
              scale: props.scale,
              rotate: props.rotate,
            });
          }
        }
      } else {
        const layerRecords = selectedLayers.reduce((acc, layer) => {
          const editor = layer.data.editor;
          if (editor) {
            const props = layer.data.props as TextLayerProps;
            const attrs = getAllAttrs(editor.state.doc);
            settings.fontFamily[layer.id] = getUniqueFontFamily(attrs);
            settings.fontSize[layer.id] = getFontSize(attrs);
            settings.lineHeight[layer.id] = getLineHeight(attrs);
            settings.letterSpacing[layer.id] = getLetterSpacing(attrs);
            settings.color[layer.id] = getColor(
              attrs,
              getAllMarks(editor.state.doc)
            );
            if (!isActive(editor.state, 'bold')) {
              settings.isBold = false;
            }
            if (!isActive(editor.state, 'italic')) {
              settings.isItalic = false;
            }
            if (!isActive(editor.state, 'underline')) {
              settings.isUnderline = false;
            }
            if (!isActive(editor.state, null, { indent: 1, listType: '' })) {
              settings.isBulletList = false;
            }
            if (
              !isActive(editor.state, null, { indent: 1, listType: 'ordered' })
            ) {
              settings.isOrderedList = false;
            }
            if (!isActive(editor.state, null, { textTransform: 'uppercase' })) {
              settings.isUppercase = false;
            }
            if (!isActive(editor.state, null, { textAlign: 'left' })) {
              settings.isAlignLeft = false;
            }
            if (!isActive(editor.state, null, { textAlign: 'right' })) {
              settings.isAlignRight = false;
            }
            if (!isActive(editor.state, null, { textAlign: 'center' })) {
              settings.isAlignCenter = false;
            }
            if (!isActive(editor.state, null, { textAlign: 'justify' })) {
              settings.isAlignJustify = false;
            }
            if (type === 'content') {
              const scale = isEqual(
                props.fontSizes,
                settings.fontSize[layer.id]
              )
                ? props.scale
                : 1;
              const div = document.createElement('div');
              div.append(editor.dom);
              const { clientHeight } = getVirtualDomHeight(
                div,
                layer.data.props.boxSize.width,
                scale
              );

              const matrix = new WebKitCSSMatrix(
                getTransformStyle({
                  position: layer.data.props.position,
                  rotate: layer.data.props.rotate,
                })
              );
              const oldCorners = visualCorners(
                layer.data.props.boxSize,
                matrix,
                layer.data.props.position
              );
              const newCorners = visualCorners(
                {
                  width: layer.data.props.boxSize.width,
                  height: clientHeight,
                },
                matrix,
                layer.data.props.position
              );
              const { changeX, changeY } = getPositionChangesBetweenTwoCorners(
                oldCorners,
                newCorners,
                'bottomRight'
              );
              actions.history
                .merge()
                .setProp<TextLayerProps>(activePage, layer.id, {
                  text: editor.dom.innerHTML,
                  fontSizes: settings.fontSize[layer.id],
                  fonts: settings.fontFamily[layer.id],
                  colors: settings.color[layer.id],
                  scale,
                  boxSize: {
                    width: layer.data.props.boxSize.width,
                    height: clientHeight,
                  },
                  position: {
                    x: layer.data.props.position.x - changeX,
                    y: layer.data.props.position.y - changeY,
                  },
                });
              acc[layer.id] = {
                ...layer.data.props,
                boxSize: {
                  width: layer.data.props.boxSize.width,
                  height: clientHeight,
                },
                position: {
                  x: layer.data.props.position.x - changeX,
                  y: layer.data.props.position.y - changeY,
                },
              };
            }
          } else {
            acc[layer.id] = layer.data.props;
          }
          return acc;
        }, {} as Record<LayerId, LayerComponentProps>);
        setSettings(settings);
        actions.setControlBox(getControlBoxSizeFromLayers(layerRecords));
      }
    },
    [
      JSON.stringify(
        selectedLayers.map((l) => ({
          id: l.id,
          boxSize: l.data.props.boxSize,
          position: l.data.props.position,
          rotate: l.data.props.rotate,
          scale: l.data.props.scale,
        }))
      ),
      editingLayer,
      textEditor?.editor,
      actions,
      fontObj,
    ]
  );

  const selectionUpdate = useCallback(() => {
    updateLayerProps('selection');
  }, [updateLayerProps]);
  const contentUpdate = useCallback(() => {
    updateLayerProps('content');
  }, [updateLayerProps]);

  useEffect(() => {
    textEditor?.editor?.events.on('selectionUpdate', selectionUpdate);
    textEditor?.editor?.events.on('update', contentUpdate);
    return () => {
      textEditor?.editor?.events.off('selectionUpdate', selectionUpdate);
      textEditor?.editor?.events.off('update', contentUpdate);
    };
  }, [textEditor?.editor, updateLayerProps]);
  useEffect(() => {
    layers.forEach((layer) => {
      layer.data.editor?.events.on('update', contentUpdate);
    });
    return () => {
      layers.forEach((layer) => {
        layer.data.editor?.events.off('update', contentUpdate);
      });
    };
  }, [JSON.stringify(layers.map((l) => l.id)), updateLayerProps]);
  const fontStyles = useCallback((fontList: FontData[]) => {
    const fontStyles: string[] = [];
    fontList.forEach((font) => {
      if (!font.name.includes('Italic')) {
        fontStyles.push('Italic');
      }

      if (font.name.includes('Bold')) {
        const weight = parseInt(font.style);
        if (weight < 600) {
          fontStyles.push('Bold');
        }
      } else {
        fontStyles.push('Bold');
      }
    });
    return fontStyles;
  }, []);

  const applyFont = (font: FontData) => {
    actions.history.new();
    if (editingLayer) {
      const editor = textEditor?.editor;
      if (editor) {
        setFontFamily(font.name)(editor.state, editor.dispatch);
        const styles = fontStyles([font]);
        if (!styles.includes('Bold')) {
          unsetBoldOfBlock(editor.state, editor.dispatch);
        }
        if (!styles.includes('Italic')) {
          unsetItalicOfBlock(editor.state, editor.dispatch);
        }
        editor.focus();

        if (editingLayer.data.editor) {
          const hiddenEditor = editingLayer.data.editor;
          const { $from, $to } = editor.state.selection;
          selectText({ from: $from.pos, to: $to.pos })(
            hiddenEditor.state,
            hiddenEditor.dispatch
          );
          setFontFamily(font.name)(hiddenEditor.state, hiddenEditor.dispatch);
          const styles = fontStyles([font]);
          if (!styles.includes('Bold')) {
            unsetBoldOfBlock(hiddenEditor.state, hiddenEditor.dispatch);
          }
          if (!styles.includes('Italic')) {
            unsetItalicOfBlock(hiddenEditor.state, hiddenEditor.dispatch);
          }
        }
      }
    } else {
      layers.forEach((layer) => {
        const editor = layer.data.editor;
        if (editor) {
          selectAll(editor.state, editor.dispatch);
          setFontFamily(font.name)(editor.state, editor.dispatch);
          const styles = fontStyles([font]);
          if (!styles.includes('Bold')) {
            unsetBoldOfBlock(editor.state, editor.dispatch);
          }
          if (!styles.includes('Italic')) {
            unsetItalicOfBlock(editor.state, editor.dispatch);
          }
        }
      });
    }
  };
  const changeFontSize = (number: number) => {
    layers.forEach((layer) => {
      const editor = layer.data.editor;
      if (editor) {
        const doc = editor.state.doc;
        editor.state.doc.nodesBetween(0, doc.content.size, (node, pos) => {
          if (node.isBlock) {
            const attrs = getAllAttrs(node);
            const fontSize = getFontSize(attrs);
            if (fontSize.length > 0) {
              const scale = layer.data.props.scale || 1;
              selectNode(pos)(editor.state, editor.dispatch);
              setFontSize(
                Math.round((fontSize[0] * scale + number) * 1000) / 1000
              )(editor.state, editor.dispatch);
            }
          }
        });
      }
    });
  };

  const handleChangeFontSize = (size: number) => {
    actions.history.new();
    const fontSize = Math.max(Math.min(800, size), 8);
    if (editingLayer) {
      const editor = textEditor?.editor;
      if (editor) {
        const func = setFontSize(
          Math.round((fontSize / editingLayer.data.props.scale) * 1000) / 1000
        );
        func(editor.state, editor.dispatch);
        editor.focus();
        if (editingLayer.data.editor) {
          const hiddenEditor = editingLayer.data.editor;
          const { $from, $to } = editor.state.selection;
          selectText({ from: $from.pos, to: $to.pos })(
            hiddenEditor.state,
            hiddenEditor.dispatch
          );
          func(hiddenEditor.state, hiddenEditor.dispatch);
        }
      }
    } else {
      layers.forEach((layer) => {
        const editor = layer.data.editor;
        if (editor) {
          selectAll(editor.state, editor.dispatch);
          setFontSize(fontSize)(editor.state, editor.dispatch);
        }
      });
    }
    setOpenFontSizeSelection(false);
  };
  const increaseFontSize = () => {
    actions.history.new();
    if (editingLayer) {
      const editor = textEditor?.editor;
      if (editor) {
        const range = {
          from: editor.state.selection.ranges[0].$from.pos,
          to: editor.state.selection.ranges[0].$to.pos,
        };
        editor.state.doc.nodesBetween(range.from, range.to, (node, pos) => {
          if (node.isBlock) {
            const attrs = getAllAttrs(node);
            const [fontSize] = getFontSize(attrs);
            const scale = editingLayer.data.props.scale;
            selectNode(pos)(editor.state, editor.dispatch);
            setFontSize(Math.round((fontSize + 1 / scale) * 1000) / 1000)(
              editor.state,
              editor.dispatch
            );
            const hiddenEditor = editingLayer.data.editor;
            if (hiddenEditor) {
              selectNode(pos)(hiddenEditor.state, hiddenEditor.dispatch);
              setFontSize(Math.round((fontSize + 1 / scale) * 1000) / 1000)(
                hiddenEditor.state,
                hiddenEditor.dispatch
              );
            }
          }
        });
        selectText(range)(editor.state, editor.dispatch);
        editor.focus();
      }
    } else {
      changeFontSize(+1);
    }
  };
  const decreaseFontSize = () => {
    actions.history.new();
    if (editingLayer) {
      const editor = textEditor?.editor;
      if (editor) {
        const range = {
          from: editor.state.selection.ranges[0].$from.pos,
          to: editor.state.selection.ranges[0].$to.pos,
        };
        editor.state.doc.nodesBetween(range.from, range.to, (node, pos) => {
          if (node.isBlock) {
            const attrs = getAllAttrs(node);
            const [fontSize] = getFontSize(attrs);
            const scale = editingLayer.data.props.scale;
            selectNode(pos)(editor.state, editor.dispatch);
            setFontSize(Math.round((fontSize - 1 / scale) * 1000) / 1000)(
              editor.state,
              editor.dispatch
            );
            const hiddenEditor = editingLayer.data.editor;
            if (hiddenEditor) {
              selectNode(pos)(hiddenEditor.state, hiddenEditor.dispatch);
              setFontSize(Math.round((fontSize - 1 / scale) * 1000) / 1000)(
                hiddenEditor.state,
                hiddenEditor.dispatch
              );
            }
          }
        });
        selectText(range)(editor.state, editor.dispatch);
        editor.focus();
      }
    } else {
      changeFontSize(-1);
    }
  };

  const backgroundIconDivider = useMemo(() => {
    if (!color) return {};
    if (color.length === 1 && new ColorParser(color[0]).white() === 100) {
      return {
        backgroundImage:
          'linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)',
      };
    }
    const size = 100 / color.length;
    return {
      backgroundImage: color
        .map((c) => `linear-gradient(to right, ${c}, ${c})`)
        .join(', '),
      backgroundSize: color
        .map((_, index) => `${size * (index + 1)}%`)
        .join(', '),
      boxShadow: 'inset 0 0 0 1px rgba(57,76,96,.15)',
    };
  }, [color]);

  const handleUpdateColor = throttle((color: string | null) => {
    if (!color) return;
    if (editingLayer) {
      const editor = textEditor?.editor;
      if (editor) {
        const func = setColor(color);
        func(editor.state, editor.dispatch);
        editor.focus();
        if (editingLayer.data.editor) {
          const hiddenEditor = editingLayer.data.editor;
          const { $from, $to } = editor.state.selection;
          selectText({ from: $from.pos, to: $to.pos })(
            hiddenEditor.state,
            hiddenEditor.dispatch
          );
          func(hiddenEditor.state, hiddenEditor.dispatch);
        }
      }
    } else {
      layers.forEach((layer) => {
        const editor = layer.data.editor;
        if (editor) {
          const attrs = getAllAttrs(editor.state.doc);
          selectAll(editor.state, editor.dispatch);
          setColor(color)(editor.state, editor.dispatch);
          setColorForBlock(color)(editor.state, editor.dispatch);
          actions.history
            .throttle(2000)
            .setProp<TextLayerProps>(activePage, layer.id, {
              colors: getColor(attrs, getAllMarks(editor.state.doc)),
            });
        }
      });
    }
  }, 16);

  const toggleStyle = (type: 'BOLD' | 'ITALIC' | 'UNDERLINE' | 'UPPERCASE') => {
    actions.history.new();
    if (editingLayer) {
      const editor = textEditor?.editor;
      if (editor) {
        switch (type) {
          case 'BOLD': {
            const fonts = editingLayer.data.props.fonts.reduce((acc, f) => {
              acc[f.name] = f;
              return acc;
            }, {} as Record<string, FontStyle>);

            let supported = true;
            editor.state.doc.nodesBetween(
              editor.state.selection.ranges[0].$from.pos,
              editor.state.selection.ranges[0].$to.pos,
              (node) => {
                const attrs = getAllAttrs(node);
                const fontFamily = getFontFamily(attrs);
                const check = fontFamily.every(
                  (f) => fonts[f] && fonts[f].name.includes('Bold')
                );
                if (!check) {
                  supported = false;
                }
              }
            );
            if (supported) {
              toggleBold(editor.state, editor.dispatch);
              editor.focus();
              if (editingLayer.data.editor) {
                const hiddenEditor = editingLayer.data.editor;
                const { $from, $to } = editor.state.selection;
                selectText({ from: $from.pos, to: $to.pos })(
                  hiddenEditor.state,
                  hiddenEditor.dispatch
                );
                toggleBold(hiddenEditor.state, hiddenEditor.dispatch);
              }
            }
            break;
          }
          case 'ITALIC': {
            toggleItalic(editor.state, editor.dispatch);
            editor.focus();
            if (editingLayer.data.editor) {
              const hiddenEditor = editingLayer.data.editor;
              const { $from, $to } = editor.state.selection;
              selectText({ from: $from.pos, to: $to.pos })(
                hiddenEditor.state,
                hiddenEditor.dispatch
              );
              toggleItalic(hiddenEditor.state, hiddenEditor.dispatch);
            }
            break;
          }
          case 'UNDERLINE': {
            toggleUnderline(editor.state, editor.dispatch);
            editor.focus();
            if (editingLayer.data.editor) {
              const hiddenEditor = editingLayer.data.editor;
              const { $from, $to } = editor.state.selection;
              selectText({ from: $from.pos, to: $to.pos })(
                hiddenEditor.state,
                hiddenEditor.dispatch
              );
              toggleUnderline(hiddenEditor.state, hiddenEditor.dispatch);
            }
            break;
          }
          case 'UPPERCASE': {
            const cmd = setTextTransform(
              isActive(editor.state, null, { textTransform: 'uppercase' })
                ? undefined
                : 'uppercase'
            );
            cmd(editor.state, editor.dispatch);
            editor.focus();
            if (editingLayer.data.editor) {
              const hiddenEditor = editingLayer.data.editor;
              const { $from, $to } = editor.state.selection;
              selectText({ from: $from.pos, to: $to.pos })(
                hiddenEditor.state,
                hiddenEditor.dispatch
              );
              cmd(hiddenEditor.state, hiddenEditor.dispatch);
            }
            break;
          }
        }
      }
    } else {
      layers.forEach((layer) => {
        const editor = layer.data.editor;
        if (editor) {
          selectAll(editor.state, editor.dispatch);
          switch (type) {
            case 'BOLD': {
              !isBold
                ? setBold(editor.state, editor.dispatch)
                : unsetBold(editor.state, editor.dispatch);
              break;
            }
            case 'ITALIC': {
              !isItalic
                ? setItalic(editor.state, editor.dispatch)
                : unsetItalic(editor.state, editor.dispatch);
              break;
            }
            case 'UNDERLINE': {
              !isUnderline
                ? setUnderline(editor.state, editor.dispatch)
                : unsetUnderline(editor.state, editor.dispatch);
              break;
            }
            case 'UPPERCASE': {
              !isUppercase
                ? setTextTransform('uppercase')(editor.state, editor.dispatch)
                : setTextTransform()(editor.state, editor.dispatch);
              break;
            }
          }
        }
      });
    }
  };

  const updateTextAlign = (
    textAlign: 'left' | 'right' | 'center' | 'justify'
  ) => {
    actions.history.new();
    const editor = textEditor?.editor;
    if (editingLayer && editor) {
      setTextAlign(textAlign)(editor.state, editor.dispatch);
      editor.focus();
      if (editingLayer.data.editor) {
        const hiddenEditor = editingLayer.data.editor;
        const { $from, $to } = editor.state.selection;
        selectText({ from: $from.pos, to: $to.pos })(
          hiddenEditor.state,
          hiddenEditor.dispatch
        );
        setTextAlign(textAlign)(hiddenEditor.state, hiddenEditor.dispatch);
      }
    } else {
      layers.forEach((layer) => {
        const editor = layer.data.editor;
        if (editor) {
          selectAll(editor.state, editor.dispatch);
          setTextAlign(textAlign)(editor.state, editor.dispatch);
        }
      });
    }
  };

  const handleChangeLetterSpacing = (spacing: number) => {
    actions.history.new();
    const editor = textEditor?.editor;
    if (editingLayer && editor) {
      setLetterSpacing(spacing)(editor.state, editor.dispatch);
      editor.focus();
      if (editingLayer.data.editor) {
        const hiddenEditor = editingLayer.data.editor;
        const { $from, $to } = editor.state.selection;
        selectText({ from: $from.pos, to: $to.pos })(
          hiddenEditor.state,
          hiddenEditor.dispatch
        );
        setLetterSpacing(spacing)(hiddenEditor.state, hiddenEditor.dispatch);
      }
    } else {
      layers.forEach((layer) => {
        const editor = layer.data.editor;
        if (editor) {
          selectAll(editor.state, editor.dispatch);
          setLetterSpacing(spacing)(editor.state, editor.dispatch);
        }
      });
    }
  };
  const handleChangeLineHeight = (lineHeight: number) => {
    actions.history.new();
    const editor = textEditor?.editor;
    if (editingLayer && editor) {
      setLineHeight(lineHeight)(editor.state, editor.dispatch);
      editor.focus();
      if (editingLayer.data.editor) {
        const hiddenEditor = editingLayer.data.editor;
        const { $from, $to } = editor.state.selection;
        selectText({ from: $from.pos, to: $to.pos })(
          hiddenEditor.state,
          hiddenEditor.dispatch
        );
        setLineHeight(lineHeight)(hiddenEditor.state, hiddenEditor.dispatch);
      }
    } else {
      layers.forEach((layer) => {
        const editor = layer.data.editor;
        if (editor) {
          selectAll(editor.state, editor.dispatch);
          setLineHeight(lineHeight)(editor.state, editor.dispatch);
        }
      });
    }
  };

  const toggleBulletList = () => {
    actions.history.new();
    if (editingLayer) {
      const editor = textEditor?.editor;
      if (editor) {
        const isValid = isActive(editor.state, null, {
          indent: 1,
          listType: '',
        });
        setBulletList(!isValid ? 1 : 0)(editor.state, editor.dispatch);
        editor.focus();
        if (editingLayer.data.editor) {
          const hiddenEditor = editingLayer.data.editor;
          const { $from, $to } = editor.state.selection;
          selectText({ from: $from.pos, to: $to.pos })(
            hiddenEditor.state,
            hiddenEditor.dispatch
          );
          setBulletList(!isValid ? 1 : 0)(
            hiddenEditor.state,
            hiddenEditor.dispatch
          );
        }
      }
    } else {
      const isValid = layers.every((layer) => {
        const editor = layer.data.editor;
        if (editor) {
          selectAll(editor.state, editor.dispatch);
          return isActive(editor.state, null, { indent: 1, listType: '' });
        }
      });
      layers.forEach((layer) => {
        const editor = layer.data.editor;
        if (editor) {
          setBulletList(!isValid ? 1 : 0)(editor.state, editor.dispatch);
        }
      });
    }
  };

  const toggleOrderedList = () => {
    actions.history.new();
    if (editingLayer) {
      const editor = textEditor?.editor;
      if (editor) {
        const isValid = isActive(editor.state, null, {
          indent: 1,
          listType: 'ordered',
        });
        setOrderedList(!isValid ? 1 : 0)(editor.state, editor.dispatch);
        editor.focus();
        if (editingLayer.data.editor) {
          const hiddenEditor = editingLayer.data.editor;
          const { $from, $to } = editor.state.selection;
          selectText({ from: $from.pos, to: $to.pos })(
            hiddenEditor.state,
            hiddenEditor.dispatch
          );
          setOrderedList(!isValid ? 1 : 0)(
            hiddenEditor.state,
            hiddenEditor.dispatch
          );
        }
      }
    } else {
      const isValid = layers.every((layer) => {
        const editor = layer.data.editor;
        if (editor) {
          selectAll(editor.state, editor.dispatch);
          return isActive(editor.state, null, {
            indent: 1,
            listType: 'ordered',
          });
        }
      });
      layers.forEach((layer) => {
        const editor = layer.data.editor;
        if (editor) {
          selectAll(editor.state, editor.dispatch);
          setOrderedList(!isValid ? 1 : 0)(editor.state, editor.dispatch);
        }
      });
    }
  };

  const handleFontSizeInputUpdate = (e: React.KeyboardEvent) => {
    const input = fontSizeInputRef.current as HTMLInputElement;
    const inputValue = input.value;
    if (e.key.toLowerCase() === 'enter') {
      fontSizeInputRef.current &&
        handleChangeFontSize(+parseFloat(inputValue).toFixed(1));
      input.blur();
    } else if (!e.key.match(/^[0-9]|./)) {
      e.preventDefault();
    }
  };

  const handleFontSizeInputBlur = () => {
    const input = fontSizeInputRef.current as HTMLInputElement;
    const inputValue = input.value;
    if (inputValue !== '--' && inputValue !== fontSize[0] + '') {
      fontSizeInputRef.current &&
        handleChangeFontSize(+parseFloat(inputValue).toFixed(1));
    }
  };

  return (
    <Fragment>
      <div>
        <div
          css={{
            border: '1px solid rgba(43,59,74,.3)',
            height: 32,
            padding: '0 2px',
            borderRadius: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            background:
              sidebar === 'FONT_FAMILY' ? 'rgba(57,76,96,.15)' : '#fff',
          }}
          onClick={() => {
            actions.setSidebar('FONT_FAMILY');
          }}
        >
          <div
            css={{
              padding: 4,
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: 14,
            }}
          >
            {fontFamily.length === 1 ? fontFamily[0].family : 'Multiple fonts'}
          </div>
          <div
            css={{
              width: 24,
              height: 24,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 16,
            }}
          >
            <ArrowDownIcon />
          </div>
        </div>
      </div>
      <div>
        <div
          css={{
            border: '1px solid rgba(43,59,74,.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 4,
          }}
        >
          <SettingButton
            css={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 0,
            }}
            onClick={decreaseFontSize}
            tooltip='Decrease font size'
          >
            <MinusIcon />
          </SettingButton>
          <div
            ref={fontSizeRef}
            css={{
              width: 42,
              height: 32,
              borderLeft: '1px solid rgba(43,59,74,.3)',
              borderRight: '1px solid rgba(43,59,74,.3)',
            }}
            onClick={() => setOpenFontSizeSelection(true)}
          >
            <input
              data-tooltip-id='btn-change-fontsize'
              ref={fontSizeInputRef}
              css={{
                width: 38,
                height: '100%',
                outline: 0,
                border: 0,
                textAlign: 'center',
              }}
              onBlur={handleFontSizeInputBlur}
              onKeyDown={handleFontSizeInputUpdate}
              onClick={() => fontSizeInputRef.current?.select()}
            />
          </div>
          <Popover
            open={openFontSizeSelection}
            anchorEl={fontSizeInputRef.current}
            placement={isMobile ? 'top' : 'bottom'}
            onClose={() => setOpenFontSizeSelection(false)}
          >
            <div css={{ maxHeight: '50vh', overflowY: 'auto' }}>
              {fontSizeList.map((i) => {
                return (
                  <div
                    key={i}
                    css={{
                      height: 40,
                      minWidth: 120,
                      padding: '0 8px',
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      ':hover': {
                        backgroundColor: 'rgba(64,87,109,.07)',
                      },
                    }}
                    onClick={() => handleChangeFontSize(i)}
                  >
                    <div css={{ flexGrow: 1 }}>{i}</div>
                    {fontSize.includes(i) && (
                      <div css={{ fontSize: 24, flexShrink: 0 }}>
                        <CheckIcon />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Popover>
          <SettingButton
            css={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              borderRadius: 0,
            }}
            onClick={increaseFontSize}
            tooltip='Increase font size'
          >
            <PlusIcon />
          </SettingButton>
          <ReactTooltip
            id='btn-change-fontsize'
            content='Font size'
            place={openFontSizeSelection ? 'left' : 'bottom'}
          />
        </div>
      </div>
      <SettingButton
        css={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          fontSize: 24,
        }}
        onClick={() => {
          actions.setSidebar('CHOOSING_COLOR');
        }}
        tooltip='Text color'
      >
        <TextAUnderlineIcon />
        <div
          css={{
            bottom: 1,
            left: '5%',
            width: '90%',
            position: 'absolute',
          }}
        >
          <div
            css={{
              paddingBottom: '16%',
              height: 0,
              position: 'relative',
              margin: 'auto',
              width: '80%',
            }}
          >
            <span
              css={{
                borderRadius: 4,
                overflow: 'hidden',
                position: 'absolute',
                inset: 0,
                backgroundRepeat: 'no-repeat',
                ...backgroundIconDivider,
              }}
            />
          </div>
        </div>
      </SettingButton>
      <SettingButton
        css={{ fontSize: 24 }}
        disabled={!fontStyles(fontFamily).includes('Bold')}
        isActive={isBold}
        onClick={() => toggleStyle('BOLD')}
        tooltip='Bold'
      >
        <FormatBoldIcon />
      </SettingButton>
      <SettingButton
        css={{ fontSize: 24 }}
        disabled={!fontStyles(fontFamily).includes('Italic')}
        isActive={isItalic}
        onClick={() => toggleStyle('ITALIC')}
        tooltip='Italics'
      >
        <FormatItalicIcon />
      </SettingButton>
      <SettingButton
        css={{ fontSize: 24 }}
        isActive={isUnderline}
        onClick={() => toggleStyle('UNDERLINE')}
        tooltip='Underline'
      >
        <FormatUnderlineIcon />
      </SettingButton>
      <SettingButton
        css={{ fontSize: 24 }}
        isActive={isUppercase}
        onClick={() => toggleStyle('UPPERCASE')}
        tooltip='Uppercase'
      >
        <FormatUppercaseIcon />
      </SettingButton>
      <div
        css={{ height: 24, width: `1px`, background: 'rgba(57,76,96,.15)' }}
      />

      <SettingButton
        css={{ fontSize: 24 }}
        isActive={isAlignLeft}
        onClick={() => updateTextAlign('left')}
        tooltip='Left'
      >
        <TextAlignLeftIcon />
      </SettingButton>
      <SettingButton
        css={{ fontSize: 24 }}
        isActive={isAlignCenter}
        onClick={() => updateTextAlign('center')}
        tooltip='Center'
      >
        <TextAlignCenterIcon />
      </SettingButton>
      <SettingButton
        css={{ fontSize: 24 }}
        isActive={isAlignRight}
        onClick={() => updateTextAlign('right')}
        tooltip='Right'
      >
        <TextAlignRightIcon />
      </SettingButton>
      <SettingButton
        css={{ fontSize: 24 }}
        isActive={isAlignJustify}
        onClick={() => updateTextAlign('justify')}
        tooltip='Justify'
      >
        <TextAlignJustifyIcon />
      </SettingButton>

      <div
        css={{ height: 24, width: `1px`, background: 'rgba(57,76,96,.15)' }}
      />
      <SettingButton
        css={{ fontSize: 24 }}
        isActive={isBulletList}
        onClick={toggleBulletList}
        tooltip='List'
      >
        <ListBulletsIcon />
      </SettingButton>
      <SettingButton
        css={{ fontSize: 24 }}
        isActive={isOrderedList}
        onClick={toggleOrderedList}
        tooltip='List'
      >
        <ListNumbersIcon />
      </SettingButton>

      <SettingButton
        ref={spacingRef}
        css={{ fontSize: 24 }}
        onClick={() => setOpenSpacingSetting(true)}
        tooltip='Spacing'
      >
        <LineSpacingIcon />
      </SettingButton>
      <Popover
        open={openSpacingSetting}
        anchorEl={spacingRef.current}
        placement={'bottom-end'}
        onClose={() => setOpenSpacingSetting(false)}
        offsets={{
          'bottom-end': { x: 0, y: 8 },
        }}
      >
        <div css={{ padding: 16, minWidth: 220, display: 'grid', rowGap: 8 }}>
          <Slider
            label={'Letter spacing'}
            min={-200}
            max={800}
            value={letterSpacing[0] * 1000 || 0}
            onChange={(v) => handleChangeLetterSpacing(v / 1000)}
          />
          <Slider
            label={'Line spacing'}
            step={0.01}
            min={0.5}
            max={2.5}
            value={lineHeight[0] || 1.4}
            onChange={handleChangeLineHeight}
          />
        </div>
      </Popover>
      <div
        css={{ height: 24, width: `1px`, background: 'rgba(57,76,96,.15)' }}
      />

      <SettingButton
        css={{ minWidth: 70 }}
        onClick={() => {
          actions.setSidebar('TEXT_EFFECT');
        }}
      >
        Effects
      </SettingButton>
      <div
        css={{ height: 24, width: `1px`, background: 'rgba(57,76,96,.15)' }}
      />
      {sidebar === 'FONT_FAMILY' && (
        <FontSidebar
          open={true}
          selected={fontFamily}
          onChangeFontFamily={applyFont}
        />
      )}

      {sidebar === 'CHOOSING_COLOR' && (
        <ColorSidebar
          open={true}
          selected={color[0]}
          onSelect={handleUpdateColor}
        />
      )}

      {sidebar === 'TEXT_EFFECT' && <TextEffectSidebar open={true} />}
    </Fragment>
  );
};

export default TextSettings;
