"use client";

import type { CardSliderSection } from "@canva-web/src/models/blogHome.model";
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
  section: CardSliderSection;
};

export function CardSlider({ section }: Props) {
  const { title, articles = [] } = section;
  if (!articles.length) return null;

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

      <div className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {articles.map((article) => (
              <div
                className="embla__slide embla__slide--card"
                key={article.id}
              >
                <Link
                  href={`/blog/${article.slug}`}
                  className="group block h-full overflow-hidden rounded-lg sm:rounded-xl border bg-background transition-transform active:scale-[0.98] sm:hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-t-lg sm:rounded-t-xl">
                    {article.cover?.url && (
                      <img
                        src={article.cover.url}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-300 sm:group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="space-y-1.5 sm:space-y-2 p-3 sm:p-4">
                    <h3 className="line-clamp-2 text-xs sm:text-sm font-semibold group-hover:text-primary">
                      {article.title}
                    </h3>
                    {article.description && (
                      <p className="line-clamp-2 sm:line-clamp-3 text-[10px] sm:text-xs text-muted-foreground">
                        {article.description}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {articles.length > 1 && (
          <div className="embla__controls embla__controls--mobile">
            <div className="embla__buttons">
              <PrevButton
                onClick={onPrevButtonClick}
                disabled={prevBtnDisabled}
                className="embla__button--mobile"
              />
              <NextButton
                onClick={onNextButtonClick}
                disabled={nextBtnDisabled}
                className="embla__button--mobile"
              />
            </div>

            <div className="embla__dots embla__dots--mobile">
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


