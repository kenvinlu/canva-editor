'use client';

import { Comment } from '@canva-web/src/models/cms.model';
import { CommentForm } from './CommentForm';
import { Reply } from 'lucide-react';
import moment from 'moment';
import { useUserStore } from '@canva-web/src/store/useUserStore';

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  allComments: Comment[];
  slug: string;
  locale: string;
  onReplyClick: (commentId: number) => void;
  replyingTo: number | null;
  onCommentAdded: () => void;
  depth: number;
}

export function CommentItem({
  comment,
  replies,
  allComments,
  slug,
  locale,
  onReplyClick,
  replyingTo,
  onCommentAdded,
  depth,
}: CommentItemProps) {
  const isReplying = replyingTo === comment.id;
  const maxDepth = 2; // Limit nesting to 3 levels total (depth 0, 1, 2)
  const canReply = depth < maxDepth; // Allow replies only at depth 0 and 1 (prevents replies at depth 2, the lowest level)
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const isHydrated = useUserStore((state) => state.hydrated);
  const canShowReplyButton = isHydrated && isLoggedIn && canReply;

  const getAuthorInitials = (name: string | null | undefined) => {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return 'U';
    }
    const parts = name.trim().split(' ').filter((n) => n.length > 0);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) {
      return parts[0][0]?.toUpperCase() || 'U';
    }
    return (parts[0][0] + parts[parts.length - 1][0])
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`${
        depth > 0 ? 'ml-8 mt-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4' : ''
      }`}
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary font-semibold text-sm">
            {comment.author?.avatar ? (
              <img
                src={comment.author.avatar}
                alt={comment.author?.name || 'User'}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span>{getAuthorInitials(comment.author?.name)}</span>
            )}
          </div>
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {/* Author and Date */}
            <div className="flex items-center gap-3 mb-3">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {comment.author?.name || 'Anonymous'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {moment(comment.createdAt).fromNow()}
              </span>
              {comment.approvalStatus === 'PENDING' && (
                <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full font-medium">
                  Pending
                </span>
              )}
            </div>

            {/* Comment Text */}
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words leading-relaxed">
              {comment.content}
            </div>
          </div>

          {/* Reply Button - Only show if user is authenticated and we haven't reached max depth */}
          {canShowReplyButton && (
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => onReplyClick(comment.id)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
              >
                <Reply className="w-4 h-4" />
                {isReplying ? 'Cancel Reply' : 'Reply'}
              </button>
            </div>
          )}

          {/* Reply Form - Only show if user is authenticated and we haven't reached max depth */}
          {isReplying && canShowReplyButton && (
            <div className="mt-4">
              <CommentForm
                slug={slug}
                locale={locale}
                threadOf={comment.id}
                onSuccess={onCommentAdded}
                onCancel={() => onReplyClick(comment.id)}
              />
            </div>
          )}

          {/* Nested Replies */}
          {replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {replies.map((reply) => {
                // Recursively get replies for this reply
                const nestedReplies = allComments.filter((comment) => {
                  if (!comment.threadOf || comment.threadOf === null) return false;
                  if (typeof comment.threadOf === 'number') {
                    return comment.threadOf === reply.id;
                  }
                  if (typeof comment.threadOf === 'object' && 'id' in comment.threadOf) {
                    return comment.threadOf.id === reply.id;
                  }
                  return false;
                }).sort((a, b) => 
                  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );

                return (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    replies={nestedReplies}
                    allComments={allComments}
                    slug={slug}
                    locale={locale}
                    onReplyClick={onReplyClick}
                    replyingTo={replyingTo}
                    onCommentAdded={onCommentAdded}
                    depth={depth + 1}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

