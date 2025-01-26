import { Layers, SerializedLayers } from './layer';

export type PageSize = {
    width: number;
    height: number;
};

export type SerializedPage = {
    layers: SerializedLayers;
    name: string;
    notes: string;
    locked?: boolean;
};

export type Page = {
    layers: Layers;
    name: string;
    notes: string;
    locked?: boolean;
};
