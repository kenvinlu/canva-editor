import React from 'react';

const ResizeIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <defs>
                <filter
                    id="_1944785510__a"
                    width="250%"
                    height="250%"
                    x="-75%"
                    y="-66.7%"
                    filterUnits="objectBoundingBox"
                >
                    <feMorphology
                        in="SourceAlpha"
                        operator="dilate"
                        radius=".5"
                        result="shadowSpreadOuter1"
                    ></feMorphology>
                    <feOffset in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset>
                    <feColorMatrix
                        in="shadowOffsetOuter1"
                        result="shadowMatrixOuter1"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.20 0"
                    ></feColorMatrix>
                    <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter2"></feOffset>
                    <feGaussianBlur
                        in="shadowOffsetOuter2"
                        result="shadowBlurOuter2"
                        stdDeviation="2.5"
                    ></feGaussianBlur>
                    <feColorMatrix
                        in="shadowBlurOuter2"
                        result="shadowMatrixOuter2"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
                    ></feColorMatrix>
                    <feMerge>
                        <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
                        <feMergeNode in="shadowMatrixOuter2"></feMergeNode>
                    </feMerge>
                </filter>
                <path
                    id="_1944785510__b"
                    d="M10 18.95a2.51 2.51 0 0 1-3-2.45v-7a2.5 2.5 0 0 1 2.74-2.49L10 7h6a3 3 0 0 1 3 3h-9v8.95z"
                ></path>
            </defs>
            <use fill="0d1216" filter="url(#_1944785510__a)" xlinkHref="#_1944785510__b"></use>
            <use fill="currentColor" xlinkHref="#_1944785510__b"></use>
        </svg>
    );
};

export default ResizeIcon;
