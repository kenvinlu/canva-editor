'use client';

import { Heart } from 'lucide-react';
import * as React from 'react';

import Image from 'next/image';
import { cn } from '../../utils';
import { Card, CardContent } from '../base/card/Card';
import { Badge } from '../base/badge/Badge';
import { Button } from '../base/button/Button';

type CardItemData = {
  id: number;
  documentId?: string;
  img?: string;
  /**
   * Primary title shown on the card.
   */
  title?: string;
  /**
   * Short description or secondary text.
   */
  description?: string;
  /**
   * Small label shown as a badge over the media.
   */
  tag?: string;
  /**
   * Optional primary metadata shown under the title
   * (e.g. dimensions).
   */
  metaPrimary?: string;
  /**
   * Optional secondary metadata
   * (e.g. "Updated recently").
   */
  metaSecondary?: string;
  /**
   * Legacy field kept for backward compatibility.
   * Falls back into `title` when provided.
   */
  desc?: string;
};

type CardItemProps = {
  data: CardItemData;
  variant?: 'default' | 'compact';
  hasVoted?: boolean;
  tag?: string;
  onVote?: (documentId: string) => void;
  voteCount?: number;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'onError'>;

export function CardItem({
  data,
  variant = 'default',
  hasVoted = false,
  tag = 'Template',
  onVote,
  voteCount,
  className,
  ...props
}: CardItemProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const title = data.title ?? data.desc ?? '';
  const description = data.description;
  const metaPrimary = data.metaPrimary;
  const metaSecondary = data.metaSecondary;
  const isCompact = variant === 'compact';

  return (
    <div className={cn('group h-full', className)} {...props}>
      <Card
        className={cn(
          'relative flex flex-col h-full overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10',
          isHovered && 'ring-1 ring-primary/30',
          isCompact && 'rounded-xl'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={cn(
            'relative m-2.5 overflow-hidden rounded-xl text-white',
            isCompact ? 'h-40' : 'h-56'
          )}
        >
          {data.img && (
            <Image
              src={data.img}
              alt={title || 'Card image'}
              fill
              className={cn(
                'object-cover transition-transform duration-300 ease-in-out',
                isHovered && 'scale-105'
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}

          {/* Gradient overlay for better legibility */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-80" />

          {/* Tag badge */}
          {(tag || title) && (
            <Badge
              variant="outline"
              className="absolute left-2 top-2 bg-background/85 text-xs font-medium backdrop-blur-sm"
            >
              {tag}
            </Badge>
          )}

          {/* Vote button */}
          {onVote && (
            <div className="absolute right-2 bottom-2 z-10 flex items-center gap-1.5">
              {voteCount !== undefined && voteCount > 0 && (
                <span
                  className={cn(
                    'rounded-full bg-background/85 backdrop-blur-sm px-2 py-1 text-xs font-medium text-foreground transition-opacity duration-300',
                    !isHovered && !hasVoted && 'opacity-0'
                  )}
                >
                  {voteCount}
                </span>
              )}
              <Button
                type="button"
                variant="outline"
                size="icon"
                className={cn(
                  'rounded-full bg-background/85 backdrop-blur-sm transition-opacity duration-300',
                  !isHovered && !hasVoted && 'opacity-0',
                  hasVoted && 'opacity-100'
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onVote?.(data.documentId || '');
                }}
                disabled={hasVoted}
              >
                <Heart
                  className={cn(
                    'h-4 w-4',
                    hasVoted
                      ? 'fill-destructive text-destructive'
                      : 'text-muted-foreground'
                  )}
                />
                <span className="sr-only">
                  {hasVoted ? 'Already voted' : 'Vote'}
                </span>
              </Button>
            </div>
          )}
        </div>

        {(title || description || metaPrimary || metaSecondary) && (
          <CardContent
            className={cn(
              'px-3 pb-3 pt-1',
              isCompact && 'pb-2 pt-1'
            )}
          >
            {title && (
              <h3
                className={cn(
                  'mb-1 line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-primary',
                  !isCompact && 'text-base'
                )}
              >
                {title}
              </h3>
            )}

            {/* {description && (
              <p className="mb-1 line-clamp-2 text-xs text-muted-foreground">
                {description}
              </p>
            )} */}

            {/* {(metaPrimary || metaSecondary) && (
              <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                {metaPrimary && (
                  <span className="rounded-full bg-muted px-2 py-0.5">
                    {metaPrimary}
                  </span>
                )}
                {metaSecondary && (
                  <span className="rounded-full bg-muted px-2 py-0.5">
                    {metaSecondary}
                  </span>
                )}
              </div>
            )} */}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
