import { createElement, ReactElement } from 'react';
import { resolveComponent } from './resolveComponent';
import { TextLayerProps } from '../../layers/TextLayer';
import { ShapeLayerProps } from '../../layers/ShapeLayer';
import { ImageLayerProps } from '../../layers/ImageLayer';
import { GroupLayerProps } from '../../layers/GroupLayer';
import {
  LayerComponentProps,
  LayerId,
  SerializedLayer,
  SerializedLayers,
  Layer,
  LayerComponent,
  LayerData,
  Layers,
} from 'canva-editor/types';
import { RootLayerProps } from '../../layers/RootLayer';
import { resolvers } from '../resolvers';
import { generateRandomID } from '../identityGenerator';
import { FrameLayerProps } from 'canva-editor/layers/FrameLayer';

export const getRandomId = (): LayerId => generateRandomID();
export const deserializeLayer = <P extends LayerComponentProps>(
  data: SerializedLayer
): LayerData<P> => {
  const { type, props } = deserializeComponent(data);
  return {
    ...(type as LayerComponent<P>).info,
    comp: type as LayerComponent<P>,
    props,
    locked: data.locked,
    child: data.child,
    parent: data.parent,
  };
};

const deserializeComponent = (data: SerializedLayer): ReactElement => {
  const {
    type: { resolvedName },
    props,
  } = data;
  const component = resolvers[resolvedName];
  return createElement(component, props) as ReactElement;
};

export const serializeLayers = (
  layers: Layers,
  rootTreeId: LayerId
): SerializedLayers => {
  let res: SerializedLayers = {};
  res[rootTreeId] = {
    type: {
      resolvedName: resolveComponent(layers[rootTreeId].data.comp),
    },
    props: layers[rootTreeId].data.props,
    locked: layers[rootTreeId].data.locked,
    child: layers[rootTreeId].data.child,
    parent: layers[rootTreeId].data.parent,
  };
  layers[rootTreeId].data.child.forEach((childId) => {
    res = { ...res, ...serializeLayers(layers, childId) };
  });
  return res;
};

export const isRootLayer = <P extends LayerComponentProps>(
  layer: Layer<RootLayerProps> | Layer<P>
): layer is Layer<RootLayerProps> => layer.data.type === 'Root';

export const isMainLayer = <P extends LayerComponentProps>(layer: Layer<P>) =>
  layer.data.parent === 'ROOT';

export const isGroupLayer = <P extends LayerComponentProps>(
  layer: Layer<GroupLayerProps> | Layer<P>
): layer is Layer<GroupLayerProps> => layer.data.type === 'Group';

export const isTextLayer = <P extends LayerComponentProps>(
  layer: Layer<TextLayerProps> | Layer<P>
): layer is Layer<TextLayerProps> => layer.data.type === 'Text';
export const isImageLayer = <P extends LayerComponentProps>(
  layer: Layer<ImageLayerProps> | Layer<P>
): layer is Layer<ImageLayerProps> => layer.data.type === 'Image';
export const isShapeLayer = <P extends LayerComponentProps>(
  layer: Layer<ShapeLayerProps> | Layer<P>
): layer is Layer<ShapeLayerProps> => layer.data.type === 'Shape';
export const isFrameLayer = <P extends LayerComponentProps>(
  layer: Layer<FrameLayerProps> | Layer<P>
): layer is Layer<FrameLayerProps> => layer.data.type === 'Frame';
