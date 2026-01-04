export const horizontalAndVerticalChange = (oldRotation: number, newRotation: number, distance: number) => {
    const angleRadians = ((newRotation - oldRotation) * Math.PI) / 180;
    return {
        width: distance * Math.cos(angleRadians),
        height: distance * Math.sin(angleRadians),
    };
};
