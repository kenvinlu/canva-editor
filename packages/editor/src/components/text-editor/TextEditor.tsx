import { useEditor } from '../../hooks';
import { TextLayerProps } from '../../layers/TextLayer';
import EditorContent from './EditorContent';
import { EffectSettings, Layer, LayerId } from 'canva-editor/types';
import { getTransformStyle } from 'canva-editor/layers';
import { getTextEffectStyle } from 'canva-editor/layers/text'

const TextEditor = () => {
    const { editorScale, layer } = useEditor((state) => {
        const textEditor = state.textEditor as { pageIndex: number; layerId: LayerId };
        const layer = state.pages[textEditor.pageIndex].layers[textEditor.layerId] as unknown as Layer<TextLayerProps>;
        return {
            editorScale: state.scale,
            textEditor,
            layer,
        };
    });
    if (!layer) {
        return null;
    }
    const editor = layer.data.editor;

    const { boxSize, position, scale, rotate, transparency, effect, colors, fontSizes } = layer.data.props;

    return (
        <div
            css={{
                touchAction: 'pan-x pan-y pinch-zoom',
                pointerEvents: 'auto',
                position: 'absolute',
                width: boxSize.width * editorScale,
                height: boxSize.height * editorScale,
                transform: getTransformStyle({
                    position: {
                        x: position.x * editorScale,
                        y: position.y * editorScale,
                    },
                    rotate,
                }),
                opacity: transparency,
                top: 0,
                left: 0,
            }}
        >
            <div
                css={{
                    width: boxSize.width / scale,
                    height: boxSize.height / scale,
                    transform: `scale(${scale * editorScale})`,
                    transformOrigin: '0 0',
                    p: {
                        '&:before': {
                            ...getTextEffectStyle(
                                effect?.name || 'none',
                                effect?.settings as EffectSettings,
                                colors[0],
                                fontSizes[0],
                            ),
                        },
                    },
                    ...getTextEffectStyle(
                        effect?.name || 'none',
                        effect?.settings as EffectSettings,
                        colors[0],
                        fontSizes[0],
                    ),
                }}
                onMouseDown={(e) => e.stopPropagation()}
            >
                {editor && <EditorContent editor={editor} />}
            </div>
        </div>
    );
};

export default TextEditor;
