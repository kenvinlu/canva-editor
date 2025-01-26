export const getVirtualDomHeight = (element: Element, width: number, scale: number) => {
    const box = document.createElement('div');
    box.style.width = `${width / scale}px`;
    box.style.visibility = 'hidden';
    box.style.top = '-9999px';
    box.style.transform = `scale(${scale})`;
    box.style.position = 'fixed';
    box.appendChild(element);
    document.body.appendChild(box);
    const clientHeight = element.clientHeight * scale;
    document.body.removeChild(box);
    return {
        clientHeight,
    };
};
