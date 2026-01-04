"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ImageProps } from "next/image";
import Image from "next/image";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  position: relative;
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const BlurContainer = styled.div<{ $hasBlur: boolean; $isVisible: boolean }>`
  position: absolute;
  inset: 0;
  overflow: hidden;
  transition: opacity 0.3s ease-in;
  background-color: ${({ $hasBlur }) => ($hasBlur ? "transparent" : "#f6f6f6")};
  opacity: ${({ $isVisible }) => ($isVisible ? "1" : "0")};
  border-radius: 6px;
`;

const StyledBlurImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const StyledImage = styled(Image)`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const FALLBACK_IMAGE = "/assets/images/default-image.jpeg"; // TODO: Change the default image

export default function ImageWithFallback(
  props: ImageProps & {
    imgClassName?: string;
  },
) {
  const forceFixedSize = {
    // width: "auto",
    // height: "auto",
    aspectRatio: "auto",
  };
  const { className, priority, blurDataURL, imgClassName = "", src, ...rest } = props;

  const shouldDebugImageFallbacks = false; // Debug blurry

  const [wasCached, setWasCached] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [didError, setDidError] = useState(false);

  const onLoad = useCallback(() => setIsLoading(false), []);
  const onError = useCallback(() => setDidError(true), []);

  const [hideFallback, setHideFallback] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setWasCached(imgRef.current?.complete ?? false), 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isLoading && !didError) {
      const timeout = setTimeout(() => {
        setHideFallback(true);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, didError]);

  const showFallback = !wasCached && !hideFallback;

  return (
    <Wrapper className={className || ""}>
      {(showFallback || shouldDebugImageFallbacks) && (
        <BlurContainer $hasBlur={!!blurDataURL} $isVisible={isLoading || shouldDebugImageFallbacks}>
          {blurDataURL ? (
            <StyledBlurImage
              {...{
                ...rest,
                src: blurDataURL,
                className: `${imgClassName}}`,
              }}
            />
          ) : (
            <div />
          )}
        </BlurContainer>
      )}
      <StyledImage
        {...{
          ...rest,
          src: didError || !src ? FALLBACK_IMAGE : src,
          style: { ...rest.style, ...forceFixedSize },
          ref: imgRef,
          priority,
          className: imgClassName,
          onLoad,
          onError,
        }}
      />
    </Wrapper>
  );
}
