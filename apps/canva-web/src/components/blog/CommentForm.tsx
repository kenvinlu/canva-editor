'use client';

import { useState } from 'react';
import { Button } from '@canva-web/src/components/base/button/Button';
import { Label } from '@canva-web/src/components/base/label/Label';
import { Send, X } from 'lucide-react';

interface CommentFormProps {
  slug: string;
  locale: string;
  threadOf?: number | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

export function CommentForm({
  slug,
  locale,
  threadOf,
  onSuccess,
  onCancel,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!content.trim()) {
      setError('Please enter a comment');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `/api/cms/article/${slug}/comments?locale=${locale}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: content.trim(),
            threadOf: threadOf ? threadOf.toString() : undefined,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to post comment');
      }

      const data = await response.json();
      if (data.success) {
        setContent('');
        setSuccess('Comment posted successfully!');
        setTimeout(() => {
          setSuccess('');
          onSuccess();
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      {threadOf && (
        <div className="mb-4 p-3 bg-accent/20 dark:bg-accentDark/20 rounded-md border border-accent dark:border-accentDark">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Replying to comment #{threadOf}
            </p>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="comment-content">
          {threadOf ? 'Your Reply' : 'Leave a Comment'}
        </Label>
        <textarea
          id="comment-content"
          className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none dark:bg-dark/40 dark:border-gray-700"
          placeholder={
            threadOf
              ? 'Write your reply...'
              : 'Share your thoughts about this article...'
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          maxLength={2000}
        />
        <p className="text-xs text-muted-foreground text-right">
          {content.length}/2000
        </p>
      </div>

      {error && (
        <div className="mt-3 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-md">
          {success}
        </div>
      )}

      <div className="mt-4 flex gap-2 justify-end">
        <Button type="submit" disabled={isSubmitting || !content.trim()}>
          <Send className="w-4 h-4" />
          {isSubmitting
            ? 'Posting...'
            : threadOf
              ? 'Post Reply'
              : 'Post Comment'}
        </Button>
        {threadOf && onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

