import React, { forwardRef, ForwardRefRenderFunction, Fragment, PropsWithChildren } from 'react';
import { useEditor } from '../../hooks';
import { BoxSize, Delta, LayerType } from 'canva-editor/types';
import { getTransformStyle } from '..';
import PlayArrowIcon from 'canva-editor/icons/PlayArrowIcon';

interface LayerBorderBoxProps {
    boxSize: BoxSize;
    position?: Delta;
    rotate: number;
    type?: 'dashed' | 'solid';
    layerType?: LayerType;
}
const LayerBorderBox: ForwardRefRenderFunction<HTMLDivElement, PropsWithChildren<LayerBorderBoxProps>> = (
    { boxSize, position, rotate, type = 'solid', layerType },
    ref,
) => {
    const { scale } = useEditor((state) => ({ scale: state.scale }));
    return (
        <div
            ref={ref}
            css={{
                width: boxSize.width * scale,
                height: boxSize.height * scale,
                boxShadow: '0 0 0 1px rgba(57,76,96,.15)',
                position: 'absolute',
                transform: position
                    ? getTransformStyle({
                          position: { x: position.x * scale, y: position.y * scale },
                          rotate,
                      })
                    : undefined,
            }}
        >
            {type === 'solid' && (
                <div
                    css={{
                        border: '2px solid #3d8eff',
                        boxShadow: '0 0 0 1px hsla(0,0%,100%,.07), inset 0 0 0 1px hsla(0,0%,100%,.07)',
                        position: 'absolute',
                        inset: -1,
                    }}
                />
            )}
            {type === 'dashed' && (
                <div
                    css={{
                        inset: -1,
                        position: 'absolute',
                        backgroundImage:
                            'linear-gradient(90deg,#fff 60%,rgba(53,71,90,.2) 0),linear-gradient(180deg,#fff 60%,rgba(53,71,90,.2) 0),linear-gradient(90deg,#fff 60%,rgba(53,71,90,.2) 0),linear-gradient(180deg,#fff 60%,rgba(53,71,90,.2) 0),linear-gradient(90deg,rgba(57,76,96,.15),rgba(57,76,96,.15)),linear-gradient(180deg,rgba(57,76,96,.15),rgba(57,76,96,.15)),linear-gradient(90deg,rgba(57,76,96,.15),rgba(57,76,96,.15)),linear-gradient(180deg,rgba(57,76,96,.15),rgba(57,76,96,.15))',
                        backgroundPosition: 'top,100%,bottom,0,center 2px,calc(100% - 2px),center calc(100% - 2px),2px',
                        backgroundRepeat: 'repeat-x,repeat-y,repeat-x,repeat-y,no-repeat,no-repeat,no-repeat,no-repeat',
                        backgroundSize:
                            '6px 2px,2px 6px,6px 2px,2px 6px,calc(100% - 6px) 1px,1px calc(100% - 4px),calc(100% - 6px) 1px,1px calc(100% - 4px)',
                    }}
                />
            )}
            {layerType === 'Video' && (
                <Fragment>
                    <div
                        css={{
                            position: 'absolute',
                            inset: 0,
                            transform: getTransformStyle({
                                rotate: -rotate,
                            }),
                            display: boxSize.width > 80 && boxSize.height > 80 ? 'flex' : 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <div
                            css={{
                                width: boxSize.height <= 180 || boxSize.width <= 180 ? 24 : 48,
                                height: boxSize.height <= 180 || boxSize.width <= 180 ? 24 : 48,
                                background: 'rgba(17,23,29,.6)',
                                borderRadius: '50%',
                                color: '#fff',
                                fontSize: boxSize.height <= 180 || boxSize.width <= 180 ? 8 : 16,
                                transform: getTransformStyle({
                                    rotate: 90,
                                }),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <PlayArrowIcon />
                        </div>
                    </div>
                </Fragment>
            )}
        </div>
    );
};

export default forwardRef<HTMLDivElement, LayerBorderBoxProps>(LayerBorderBox);
