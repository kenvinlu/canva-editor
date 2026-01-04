'use client';

import { Project } from '../../models/project.model';
import Pagination from '../base/pagination/Pagination';
import Search from '../base/search/Search';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '../base/button/Button';
import { cn } from '@canva-web/src/utils';
import { useState } from 'react';

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
  const totalPages = Math.ceil(totalItems / limit);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  return (
    <section className="mb-16 py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Your Projects
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Create, manage, and organize all your design projects in one place
              </p>
            </div>
            <Link href="/templates">
              <Button
                size="lg"
                className="group h-12 px-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
                Create New Project
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <Search placeholder="Search projects by name..." />
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {projects.map((project: Project) => (
                <Link
                  key={project.documentId}
                  href={`/design/${project.documentId}`}
                  className="group relative"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
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
                          Open Project
                        </div>
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
                        {project.desc || 'Untitled Project'}
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
              No projects found
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              {totalItems === 0
                ? "Get started by creating your first project. Choose from our templates or start from scratch."
                : "Try adjusting your search terms to find what you're looking for."}
            </p>
            {totalItems === 0 && (
              <Link href="/templates">
                <Button size="lg" className="h-12 px-8">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Project
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
