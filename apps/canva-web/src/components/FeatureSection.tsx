'use client';

import { CheckCircle2, LayoutTemplate, ServerCog, Sparkles } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './base/card/Card';
import { useTranslations } from 'next-intl';

export default function FeatureSection() {
  const t = useTranslations('home');

  // Features for the why choose us section
  const features = [
    {
      title: t('features.0.title'),
      description:
        t('features.0.description'),
      icon: <CheckCircle2 className="h-6 w-6" />,
    },
    {
      title: t('features.1.title'),
      description:
        t('features.1.description'),
      icon: <ServerCog className="h-6 w-6" />,
    },
    {
      title: t('features.2.title'),
      description:
        t('features.2.description'),
      icon: <LayoutTemplate className="h-6 w-6" />,
    },
    {
      title: t('features.3.title'),
      description:
        t('features.3.description'),
      icon: <Sparkles className="h-6 w-6" />,
    },
  ];
  return (
    <>
      <div className="mb-10 flex flex-col items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
          {t('whyChooseUsTitle')}
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          {t('whyChooseUsSubTitle')}
        </h2>
        <p className="mt-4 max-w-2xl text-center text-muted-foreground md:text-lg">
          {t('whyChooseUsDescription')}
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="group h-full border-border/60 bg-card/95 shadow-sm transition hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/15"
          >
            <CardHeader className="mt-2 pb-2">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                {feature.icon}
              </div>
              <CardTitle className="text-lg font-semibold">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className=" pb-6">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
