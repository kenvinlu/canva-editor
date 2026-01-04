'use client';

import { useState, useEffect } from 'react';
import { Comment } from '@canva-web/src/models/cms.model';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import { MessageSquare, LogIn } from 'lucide-react';
import { useUserStore } from '@canva-web/src/store/useUserStore';
import { Button } from '@canva-web/src/components/base/button/Button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface CommentSectionProps {
  slug: string;
  locale?: string;
}

interface CommentResponse {
  data: Comment[];
  meta?: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export function CommentSection({ slug, locale = 'en' }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const t = useTranslations('blog');
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const isHydrated = useUserStore((state) => state.hydrated);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/cms/article/${slug}/comments?locale=${locale}&hierarchical=false`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data: CommentResponse = await response.json();
      setComments(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [slug, locale]);

  const handleCommentAdded = () => {
    fetchComments();
    setReplyingTo(null);
  };

  const handleReplyClick = (commentId: number) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  return (
    <div className="mt-12 pt-8 pb-16 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
          <MessageSquare className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('commentsTitle')}
          </h2>
          {comments.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('commentsCount', { count: comments.length })}
            </p>
          )}
        </div>
      </div>

      {/* Show login prompt for guests, comment form for authenticated users */}
      {isHydrated && !isLoggedIn ? (
        <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('commentsLoginDescription')}
              </p>
            <Link href={`/sign-in?redirectTo=${encodeURIComponent(`/blog/${slug}`)}`}>
              <Button>
                <LogIn className="w-4 h-4" />
                {t('commentsLoginCta')}
              </Button>
            </Link>
          </div>
        </div>
      ) : isHydrated && isLoggedIn ? (
        <CommentForm
          slug={slug}
          locale={locale}
          threadOf={replyingTo}
          onSuccess={handleCommentAdded}
          onCancel={replyingTo ? () => setReplyingTo(null) : undefined}
        />
      ) : null}

      {loading ? (
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
          Loading comments...
        </div>
      ) : error ? (
        <div className="mt-8 text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-md">
          {error}
        </div>
      ) : comments.length === 0 ? (
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400 py-8">
          {t('commentsEmpty')}
        </div>
      ) : (
        <CommentList
          comments={comments}
          slug={slug}
          locale={locale}
          onReplyClick={handleReplyClick}
          replyingTo={replyingTo}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
}

