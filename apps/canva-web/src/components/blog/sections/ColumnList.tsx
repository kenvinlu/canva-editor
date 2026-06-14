"use client";

import { useState, useEffect } from "react";
import type { ColumnListSection } from "@canva-web/src/models/blogHome.model";
import { Link } from "@canva-web/src/i18n/navigation";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "@canva-web/src/components/base/carousel/EmblaCarouselArrowButtons";
import {
  DotButton,
  useDotButton,
} from "@canva-web/src/components/base/carousel/EmblaCarouselDotButton";
import "@canva-web/src/components/base/carousel/carousel.css";

type Props = {
  section: ColumnListSection;
};

function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export function ColumnList({ section }: Props) {
  const { title, articles = [], columns } = section;
  const [isMobile, setIsMobile] = useState(false);

  if (!articles.length) return null;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const gridCols =
    columns === 4
      ? "lg:grid-cols-4"
      : columns === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-2 lg:grid-cols-3";

  const cols = columns && columns > 0 ? columns : 3;
  // Mobile: 1 column × 3 rows = 3 items per slide
  // Desktop: columns × 3 rows = itemsPerSlide
  const itemsPerSlide = isMobile ? 3 : cols * 3;
  const slides = chunk(articles, itemsPerSlide);

  const options: EmblaOptionsType = {
    loop: true,
    align: "start",
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="space-y-3 sm:space-y-4">
      {title && (
        <h2 className="text-lg font-semibold sm:text-xl px-1">{title}</h2>
      )}

      <div className="embla embla--list">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {slides.map((group, slideIdx) => (
              <div
                key={slideIdx}
                className="embla__slide embla__slide--list"
              >
                <div className={`grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 ${gridCols}`}>
                  {group.map((article) => (
                    <Link
                      key={article.id}
                      href={`/blog/${article.slug}`}
                      className="flex gap-3 sm:gap-4 rounded-lg border bg-background p-3 sm:p-4 transition-colors active:bg-muted/50 sm:hover:border-primary/40"
                    >
                      <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                        <h3 className="line-clamp-2 text-xs sm:text-sm font-semibold sm:hover:text-primary">
                          {article.title}
                        </h3>
                        {article.description && (
                          <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 sm:line-clamp-3">
                            {article.description}
                          </p>
                        )}
                      </div>
                      {article.cover?.url && (
                        <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-md">
                          <img
                            src={article.cover.url}
                            alt={article.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {slides.length > 1 && (
          <div className="embla__controls">
            <PrevButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
              className="embla__button embla__button--overlay-left embla__button--mobile"
            />
            <NextButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
              className="embla__button embla__button--overlay-right embla__button--mobile"
            />

            <div className="embla__dots embla__dots--bottom embla__dots--small embla__dots--mobile">
              {scrollSnaps.map((_, index) => (
                <DotButton
                  key={index}
                  onClick={() => onDotButtonClick(index)}
                  className={`embla__dot embla__dot--mobile${
                    index === selectedIndex ? " embla__dot--selected" : ""
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


