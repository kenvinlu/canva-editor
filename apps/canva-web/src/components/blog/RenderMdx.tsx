'use client';
import { Article, Page } from "@canva-web/src/models/cms.model";
import { cn } from "@canva-web/src/utils";

type Props = {
  blog: Article | Page;
  className?: string;
};

export default function RenderMdx({ blog, className }: Props) {
  return (
    <div
      className={cn(
        "ck-content",
        "max-w-none",
        className
      )}
      dangerouslySetInnerHTML={{ __html: blog.content }}
    />
  );
}
