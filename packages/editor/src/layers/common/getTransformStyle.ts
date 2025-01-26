import { LayerComponentProps } from "canva-editor/types";

export const getTransformStyle = (props: Partial<LayerComponentProps & { rotate: number }>) => {
    const res: string[] = [];
    if (props.position) {
        res.push(`translate(${props.position.x}px, ${props.position.y}px)`);
    }
    if (props.scale) {
        res.push(`scale(${props.scale})`);
    }
    if (props.rotate) {
        res.push(`rotate(${props.rotate}deg)`);
    }
    return res.join(' ');
};
