'use client';

import { ArrowRight, Cog, Layers } from 'lucide-react';
import { Button } from './base/button/Button';
import Link from 'next/link';
import MaskedImage from './masked-image/MaskedImage';
import PolygonIcon from './icons/PolygonIcon';
import { useTranslations } from 'next-intl';

export default function NemoSection() {
  const t = useTranslations('home');
  return (
    <section className="relative primary-bg overflow-hidden bg-gradient-to-b from-muted/50 via-muted/25 to-background py-24 md:py-32">
      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                {t('slogan')}
              </div>
              <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:leading-[1.1]">
                {t('buildYourOwn')}
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {t('designTool')}
                </span>
              </h1>
              <p className="max-w-[700px] text-lg text-muted-foreground md:text-lg">
                {t('description')}
                <br />
                {t('startShapingDescription')}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 gap-1.5 px-8">
                <Link href="/demo">
                  {t('tryItNow')} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8">
                <Link href="/docs">
                  {t('setUpLocally')}
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Layers className="h-5 w-5 text-primary/70" />
                <span>{t('monorepo')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cog className="h-5 w-5 text-primary/70" />
                <span>{t('easyToCustomize')}</span>
              </div>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[800px] lg:block">
            <MaskedImage
              id="polygon-mask"
              svg={
                <PolygonIcon
                  props={{ fill: 'black', width: 0, height: 0 }}
                  clipPathId="polygon-mask"
                />
              }
              src="/images/banner.png"
            />
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
}
