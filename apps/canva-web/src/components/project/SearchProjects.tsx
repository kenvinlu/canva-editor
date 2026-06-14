'use client';

import { Project } from '../../models/project.model';
import Pagination from '../base/pagination/Pagination';
import Search from '../base/search/Search';
import { Link, useRouter } from '@canva-web/src/i18n/navigation';
import Image from 'next/image';
import { Plus, Sparkles, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '../base/button/Button';
import { cn } from '@canva-web/src/utils';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { createProject, deleteProject } from '@canva-web/src/services/project.service';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../base/dropdown-menu/DropdownMenu';
import { useUserStore } from '@canva-web/src/store/useUserStore';
import { toast } from '@canva-web/src/hooks/use-toast';

type Props = {
  projects: Project[];
  totalItems: number;
  limit: number;
};

export default function SearchProjects({
  projects = [],
  totalItems,
  limit,
}: Props) {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [projectsList, setProjectsList] = useState<Project[]>(projects);
  const [totalItemsCount, setTotalItemsCount] = useState(totalItems);
  const router = useRouter();
  const user = useUserStore((state) => state.userData);
  const t = useTranslations('common');
  const totalPages = Math.ceil(totalItemsCount / limit);

  // Sync projectsList and totalItemsCount with props when they change
  useEffect(() => {
    setProjectsList(projects);
    setTotalItemsCount(totalItems);
  }, [projects, totalItems]);

  const handleCreateProject = async () => {
    if (isCreating || !user) {
      if (!user) {
        router.push(`/sign-in?redirectTo=${encodeURIComponent('/projects')}`);
      }
      return;
    }

    setIsCreating(true);
    try {
      const project = await createProject();
      if (project?.data) {
        router.push(`/design/${project.data.documentId}`);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      setIsCreating(false);
    }
  };
  
  const handleDeleteProject = async (e: React.MouseEvent, documentId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!documentId || deletingProjectId === documentId) return;
    
    // if (!confirm(t('confirmDeleteProject') || 'Are you sure you want to delete this project?')) {
    //   return;
    // }

    setDeletingProjectId(documentId);
    try {
      const result = await deleteProject(documentId);
      if (result?.data) {
        // Optimistically update the UI
        const updatedList = projectsList.filter(p => p.documentId !== documentId);
        setProjectsList(updatedList);
        setTotalItemsCount(Math.max(0, totalItemsCount - 1));
        
        // Show success toast
        toast({
          title: t('projectDeleted') || 'Project deleted',
          description: t('projectDeletedSuccessfully') || 'Project has been deleted successfully',
          variant: 'info',
        });
        
        // Force a full navigation to ensure fresh data is fetched
        // This ensures the revalidated cache is used
        router.push('/projects');
        setDeletingProjectId(null);
      } else {
        setDeletingProjectId(null);
        toast({
          title: t('failedToDeleteProject') || 'Failed to delete project',
          description: t('failedToDeleteProjectDescription') || 'Failed to delete project. Please try again.',
          variant: 'warning',
        });
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      setDeletingProjectId(null);
      toast({
        title: t('failedToDeleteProject') || 'Failed to delete project',
        description: t('failedToDeleteProjectDescription') || 'Failed to delete project. Please try again.',
        variant: 'destructive',
      });
    }
  };
  return (
    <section className="mb-16 py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                {t('yourProjects')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {t('exploreLatestProjects')}
              </p>
            </div>
            <Button
              size="lg"
              className="group h-12 px-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={handleCreateProject}
              disabled={isCreating}
            >
              <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
              {isCreating ? (t('creatingProject') || 'Creating...') : t('createProject')}
            </Button>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <Search placeholder={t('searchProjectsPlaceholder')} />
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {projectsList.map((project: Project) => (
                <div
                  key={project.documentId}
                  className="group relative"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <Link
                    href={`/design/${project.documentId}`}
                    className="block"
                  >
                    <div
                      className={cn(
                        'relative flex flex-col bg-white dark:bg-card rounded-xl overflow-hidden',
                        'border border-border shadow-sm transition-all duration-300',
                        'hover:shadow-2xl hover:scale-[1.02] hover:border-primary/20',
                        'h-full'
                      )}
                    >
                      {/* Image Container */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                        {project.img?.url ? (
                          <Image
                            src={project.img.url}
                            alt={project.desc || 'Project thumbnail'}
                            fill
                            className={cn(
                              'object-cover transition-transform duration-500 ease-out',
                              hoveredProject === project.id && 'scale-110'
                            )}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                            <Sparkles className="h-12 w-12 text-primary/30" />
                          </div>
                        )}
                        
                        {/* Overlay on hover */}
                        <div
                          className={cn(
                            'absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0',
                            'opacity-0 transition-opacity duration-300',
                            hoveredProject === project.id && 'opacity-100'
                          )}
                        />
                        
                        {/* View indicator on hover */}
                        <div
                          className={cn(
                            'absolute inset-0 flex items-center justify-center',
                            'opacity-0 transition-opacity duration-300',
                            hoveredProject === project.id && 'opacity-100'
                          )}
                        >
                          <div className="px-4 py-2 bg-white/90 dark:bg-card/90 backdrop-blur-sm rounded-full text-sm font-semibold text-foreground shadow-lg">
                            {t('openProject')}
                          </div>
                        </div>

                        {/* 3-dots menu */}
                        <div
                          className={cn(
                            'absolute top-2 right-2 z-10',
                            'opacity-0 transition-opacity duration-300',
                            hoveredProject === project.id && 'opacity-100'
                          )}
                          onClick={(e) => e.preventDefault()}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 bg-white/90 dark:bg-card/90 backdrop-blur-sm hover:bg-white dark:hover:bg-card"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={(e) => handleDeleteProject(e, project.documentId)}
                                disabled={deletingProjectId === project.documentId}
                                className="capitalize"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {deletingProjectId === project.documentId
                                  ? (t('deleting') || 'Deleting...')
                                  : (t('remove') || 'Remove')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <h3
                          className={cn(
                            'text-base font-semibold text-foreground line-clamp-2',
                            'transition-colors duration-200',
                            hoveredProject === project.id && 'text-primary'
                          )}
                        >
                          {project.title || project.desc || t('untitledProject')}
                        </h3>
                        {project.createdAt && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(project.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center pt-8 border-t border-border">
                <Pagination totalPages={totalPages} />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="rounded-full bg-muted p-6 mb-6">
              <Sparkles className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              {t('noProjectsFound')}
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              {totalItems === 0
                ? t('noProjectsFoundDescription')
                : t('noProjectsFoundDescription')}
            </p>
            {totalItems === 0 && (
              <Button
                size="lg"
                className="h-12 px-8"
                onClick={handleCreateProject}
                disabled={isCreating}
              >
                <Plus className="mr-2 h-5 w-5" />
                {isCreating ? (t('creatingProject') || 'Creating...') : t('createYourFirstProject')}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
