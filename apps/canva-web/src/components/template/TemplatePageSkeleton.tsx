'use client';

import BaseSkeleton from '../base/skeleton/BaseSkeleton';

export default function TemplatePageSkeleton() {
  return (
    <section className="mb-16">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        {/* TopPageCard Skeleton */}
        <div className="w-full p-4 border border-gray-200 rounded-xl shadow-xs sm:p-8 mb-8">
          <div className="flex flex-col">
            {/* Title skeleton */}
            <BaseSkeleton style={{ height: '40px', width: '256px', marginBottom: '16px' }} />
            {/* Underline skeleton */}
            <BaseSkeleton style={{ height: '8px', width: '128px', marginBottom: '16px' }} />
            {/* Subtitle skeleton */}
            <BaseSkeleton style={{ height: '24px', width: '100%', maxWidth: '672px', marginBottom: '16px' }} />
            {/* Search box skeleton */}
            <div className="mt-10 w-full">
              <BaseSkeleton style={{ height: '48px', width: '100%' }} />
            </div>
          </div>
        </div>

        {/* Template Grid Skeleton */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 h-full">
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
      </div>
    </section>
  );
}

