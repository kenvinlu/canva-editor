export const isElementInViewport = (viewPort: HTMLElement, element: HTMLElement) => {
    const distanceToTop = element.offsetTop;
    return (
        viewPort.scrollTop + viewPort.offsetHeight >= distanceToTop &&
        viewPort.scrollTop < element.offsetHeight + distanceToTop
    );
};
