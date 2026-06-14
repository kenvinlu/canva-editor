"use client";

import { useState, useEffect } from "react";
import type { HeroSlideshowSection } from "@canva-web/src/models/blogHome.model";
import { Link } from "@canva-web/src/i18n/navigation";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import Fade from "embla-carousel-fade";
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
  section: HeroSlideshowSection;
};

export function HeroSlideshow({ section }: Props) {
  const articles = section.articles || [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!articles.length) return null;

  const options: EmblaOptionsType = {
    loop: true,
    align: "center",
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Fade()]);

  const { scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  useEffect(() => {
    if (!emblaApi) return;
    const updateSelectedIndex = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", updateSelectedIndex);
    updateSelectedIndex();
    return () => {
      emblaApi.off("select", updateSelectedIndex);
    };
  }, [emblaApi]);

  const currentArticle = articles[selectedIndex] || articles[0];

  return (
    <section className="relative overflow-hidden rounded-2xl">
      <div className="embla embla--hero">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {articles.map((article, index) => (
              <div className="embla__slide" key={article.id}>
                {article.cover?.url && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
                    <img
                      src={article.cover.url}
                      alt={article.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Overlay content */}
        {currentArticle && (
          <div className="pointer-events-none absolute inset-0 flex items-end justify-start rounded-2xl bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 sm:p-6 md:p-8 text-white">
            <div className="pointer-events-auto max-w-xl space-y-2 sm:space-y-3">
              <Link
                href={`/blog/${currentArticle.slug}`}
                className="block text-xl font-semibold sm:text-2xl md:text-3xl lg:text-4xl hover:underline"
              >
                {currentArticle.title}
              </Link>

              {currentArticle.description && (
                <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 sm:line-clamp-3">
                  {currentArticle.description}
                </p>
              )}
            </div>
          </div>
        )}

        {articles.length > 1 && (
          <div className="embla__controls embla__controls--hero">
            <PrevButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
              className="embla__button embla__button--overlay-left embla__button--hero"
            />
            <NextButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
              className="embla__button embla__button--overlay-right embla__button--hero"
            />

            <div className="embla__dots embla__dots--bottom">
              {scrollSnaps.map((_, index) => (
                <DotButton
                  key={index}
                  onClick={() => onDotButtonClick(index)}
                  className={`embla__dot${
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

