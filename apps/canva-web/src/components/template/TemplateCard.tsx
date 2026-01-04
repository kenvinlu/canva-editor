"use client";

import { Template } from "../../models/template.model";
import { CardItem } from "../card/CardItem";
import { getBestImageFormat } from "@canva-web/src/utils/image";
import { updateVoteCount } from "@canva-web/src/services/template.service";
import { useEffect, useState } from "react";
import { toast } from "@canva-web/src/utils/toast";

const VOTE_COOKIE_PREFIX = "template_vote_";

// Helper function to check if a cookie exists
const checkCookie = (name: string): boolean => {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split("; ")
    .some((row) => row.startsWith(`${name}=`));
};

type TemplateCardProps = {
  template: Template;
  variant?: "default" | "compact";
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onError">;

export function TemplateCard({
  template,
  variant = "default",
  className,
}: TemplateCardProps) {
  const [voteCount, setVoteCount] = useState<number>(
    template.vote || 0
  );
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  // Check vote status from cookies on mount
  useEffect(() => {
    if (template.documentId) {
      const voteCookieName = `${VOTE_COOKIE_PREFIX}${template.documentId}`;
      const voted = checkCookie(voteCookieName);
      setHasVoted(voted);
    }
  }, [template.documentId]);

  const handleVote = async (documentId: string) => {
    if (hasVoted || isVoting || !documentId) {
      return;
    }

    setIsVoting(true);
    try {
      const response = await updateVoteCount(documentId, voteCount + 1);
      console.log(response)
      if (!response?.success) {
        throw new Error(response?.error?.message || 'Failed to update vote count');
      }
      setVoteCount(response?.data?.voteCount || 0);
      setHasVoted(true);
    } catch (error) {
      console.error("Vote error:", error);
      toast.error((error as Error)?.message || "Failed to update vote count");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <CardItem
      data={{
        id: template.id,
        documentId: template.documentId,
        img: getBestImageFormat(template.img)?.url,
        title: template.title || template.desc,
        description: template.desc,
        tag: "Template",
        metaPrimary: template.data?.dimensions,
        metaSecondary: template.updatedAt
          ? `Updated ${template.updatedAt}`
          : undefined,
      }}
      className={className}
      variant={variant}
      hasVoted={hasVoted}
      onVote={handleVote}
      voteCount={voteCount}
      data-testid="template-card"
    />
  );
}
