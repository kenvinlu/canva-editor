'use client';

import { Comment } from '@canva-web/src/models/cms.model';
import { CommentItem } from './CommentItem';

interface CommentListProps {
  comments: Comment[];
  slug: string;
  locale: string;
  onReplyClick: (commentId: number) => void;
  replyingTo: number | null;
  onCommentAdded: () => void;
}

export function CommentList({
  comments,
  slug,
  locale,
  onReplyClick,
  replyingTo,
  onCommentAdded,
}: CommentListProps) {
  // Group comments by thread (top-level comments and their replies)
  // Top-level comments have threadOf as null or undefined
  const topLevelComments = comments.filter((comment) => {
    // If threadOf is null, undefined, or falsy, it's a top-level comment
    if (!comment.threadOf || comment.threadOf === null) return true;
    // If threadOf is a number, it's a reply (not top-level)
    if (typeof comment.threadOf === 'number') return false;
    // If threadOf is an object, it's a reply (not top-level)
    if (typeof comment.threadOf === 'object') return false;
    return true;
  });

  // Recursively get all replies for a comment (including nested replies)
  const getReplies = (commentId: number): Comment[] => {
    const directReplies = comments.filter((comment) => {
      // Must have a threadOf value
      if (!comment.threadOf || comment.threadOf === null) return false;
      
      // Check if threadOf matches the parent comment ID
      if (typeof comment.threadOf === 'number') {
        return comment.threadOf === commentId;
      }
      if (typeof comment.threadOf === 'object' && 'id' in comment.threadOf) {
        return comment.threadOf.id === commentId;
      }
      return false;
    });

    // Sort replies by creation date (oldest first)
    return directReplies.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  };

  return (
    <div className="space-y-6 mt-8">
      {topLevelComments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          replies={getReplies(comment.id)}
          allComments={comments}
          slug={slug}
          locale={locale}
          onReplyClick={onReplyClick}
          replyingTo={replyingTo}
          onCommentAdded={onCommentAdded}
          depth={0}
        />
      ))}
    </div>
  );
}

