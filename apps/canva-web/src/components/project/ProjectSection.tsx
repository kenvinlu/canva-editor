import Link from 'next/link';
import { Project } from '../../models/project.model';
import { Button } from '../base/button/Button';
import { ArrowRight } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { useTranslations } from 'next-intl';

type Props = {
  projects: Project[];
};

export default function ProjectSection({ projects = [] }: Props) {
  const t = useTranslations('home');
  return (
    <>
      <div className="mb-8 flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          {t('yourProjects')}
        </h2>
        <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
        <p className="mt-4 max-w-2xl text-center text-muted-foreground">
          {t('exploreLatestProjects')}
        </p>
      </div>

      {projects.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {projects.map((project) => (
              <Link
                key={project.documentId}
                href={`/design/${project.documentId}`}
              >
                <ProjectCard project={project} />
              </Link>
            ))}
          </div>
          {projects.length === 4 && (
            <div className="mt-10 flex justify-center group h-12 px-8">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="group h-12 px-8"
              >
                <Link href="/projects">
                  {t('viewAllProjects')}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-center">
          <Link
            href="/templates"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            {t('createProject')}
          </Link>
        </div>
      )}
    </>
  );
}
