'use client';

import BaseSkeleton from '../base/skeleton/BaseSkeleton';

export default function ProjectPageSkeleton() {
  return (
    <>
      {/* SearchProjects Skeleton */}
      <section className="mb-16 py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Section Skeleton */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
              <div className="space-y-2">
                {/* Title skeleton */}
                <BaseSkeleton style={{ height: '48px', width: '280px', marginBottom: 0 }} />
                {/* Description skeleton */}
                <BaseSkeleton style={{ height: '24px', width: '100%', maxWidth: '672px', marginBottom: 0 }} />
              </div>
              {/* Button skeleton */}
              <BaseSkeleton style={{ height: '48px', width: '200px', marginBottom: 0 }} />
            </div>

            {/* Search Bar Skeleton */}
            <div className="max-w-2xl">
              <BaseSkeleton style={{ height: '48px', width: '100%', marginBottom: 0 }} />
            </div>
          </div>

          {/* Projects Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="relative flex flex-col bg-white dark:bg-card rounded-xl overflow-hidden border border-border shadow-sm h-full"
              >
                {/* Image Container Skeleton */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  <BaseSkeleton 
                    style={{ 
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 0,
                      marginBottom: 0
                    }} 
                  />
                </div>

                {/* Content Skeleton */}
                <div className="p-4 space-y-2">
                  <BaseSkeleton 
                    style={{ height: '20px', width: '100%', marginBottom: '8px' }} 
                  />
                  <BaseSkeleton 
                    style={{ height: '14px', width: '60%', marginBottom: 0 }} 
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex justify-center pt-8 border-t border-border">
            <BaseSkeleton style={{ height: '40px', width: '300px', marginBottom: 0 }} />
          </div>
        </div>
      </section>

      {/* TemplateSection Skeleton */}
      <section className="mb-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-10 flex flex-col items-center text-center">
            <BaseSkeleton style={{ height: '40px', width: '400px', marginBottom: '12px' }} />
            <div className="mt-3 flex items-center gap-2">
              <BaseSkeleton style={{ height: '24px', width: '120px', marginBottom: 0 }} />
              <BaseSkeleton style={{ height: '20px', width: '300px', marginBottom: 0 }} />
            </div>
          </div>

          {/* Templates Grid Skeleton */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="relative flex flex-col h-full overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-sm"
              >
                {/* Image skeleton */}
                <div className="relative m-2.5 overflow-hidden rounded-xl h-56 bg-muted/40">
                  <BaseSkeleton 
                    style={{ 
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '0.75rem',
                      marginBottom: 0
                    }} 
                  />
                  {/* Badge skeleton */}
                  <div className="absolute left-2 top-2">
                    <BaseSkeleton 
                      style={{ height: '20px', width: '64px', borderRadius: '6px', marginBottom: 0 }} 
                    />
                  </div>
                </div>

                {/* Content skeleton */}
                <div className="px-3 pb-3 pt-1">
                  <BaseSkeleton 
                    style={{ height: '20px', width: '100%', marginBottom: '8px' }} 
                  />
                  <BaseSkeleton 
                    style={{ height: '16px', width: '75%', marginBottom: 0 }} 
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Button Skeleton */}
          <div className="mt-10 flex justify-center">
            <BaseSkeleton style={{ height: '48px', width: '200px', borderRadius: '9999px', marginBottom: 0 }} />
          </div>
        </div>
      </section>
    </>
  );
}

