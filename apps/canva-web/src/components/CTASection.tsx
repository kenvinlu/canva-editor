'use client';

import Link from 'next/link';
import { Button } from './base/button/Button';
import { ExternalLink, Github } from 'lucide-react';
import { getGithubUrl } from '@canva-web/config/Env';
import { useTranslations } from 'next-intl';

export default function CTASection() {
  const t = useTranslations('home');
  return (
    <>
      <div className="relative overflow-hidden rounded-xl bg-primary/10 p-8 md:p-12">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]" />
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t('readyToMakeItYoursTitle')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            {t('readyToMakeItYoursDescription')}
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/demo">
              <Button size="lg" className="h-12 px-8">
                {t('readyToMakeItYoursButton')}
              </Button>
            </Link>
            <Link href={getGithubUrl()} target="_blank">
              <Button variant="outline" size="lg" className="h-12 px-8">
                <Github className="h-4 w-4" />
                {t('forkIt')}
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
