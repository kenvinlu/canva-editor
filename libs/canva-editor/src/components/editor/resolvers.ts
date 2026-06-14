import { ElementType } from 'react';
import ShapeLayer from 'canva-editor/layers/ShapeLayer';
import TextLayer from 'canva-editor/layers/TextLayer';
import ImageLayer from 'canva-editor/layers/ImageLayer';
import GroupLayer from 'canva-editor/layers/GroupLayer';
import RootLayer from 'canva-editor/layers/RootLayer';

export const resolvers: Record<string, ElementType> = {
    RootLayer,
    ShapeLayer,
    TextLayer,
    ImageLayer,
    GroupLayer,
};
