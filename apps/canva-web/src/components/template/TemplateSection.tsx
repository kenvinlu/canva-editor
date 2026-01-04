import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '../base/button/Button';
import { Template } from '../../models/template.model';
import TemplateDialogCard from './TemplateDialogCard';
import { useTranslations } from 'next-intl';

type Props = {
  templates: Template[];
};

export default function TemplateSection({ templates = [] }: Props) {
  const t = useTranslations('home');
  return (
    <>
      <div className="mb-10 flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          {t('designTemplatesForEveryProject')}
        </h2>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
            {t('newAndTrending')}
          </span>
          <span>{t('readyMadeLayoutsYouCanCustomizeInAFewClicks')}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {templates.map((template) => (
          <TemplateDialogCard key={template.id} template={template} />
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Button
          asChild
          variant="outline"
          size="lg"
          className="group h-12 rounded-full border-primary/30 bg-background/60 px-8 shadow-sm backdrop-blur transition hover:border-primary hover:bg-primary/5"
        >
          <Link href="/templates">
            <span className="mr-1 font-medium">{t('viewAllTemplates')}</span>
            <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </>
  );
}
