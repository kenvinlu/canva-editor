'use client';
import { Article } from "@canva-web/src/models/cms.model";
import { cn } from "@canva-web/src/utils";

type Props = {
  blog: Article;
  className?: string;
};

export default function RenderMdx({ blog, className }: Props) {
  return (
    <div
      className={cn(
        "prose prose-lg sm:prose-xl",
        "max-w-none",
        "prose-headings:font-bold prose-headings:tracking-tight",
        "prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8",
        "prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-700 prose-h2:pb-2",
        "prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6",
        "prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium",
        "prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold",
        "prose-blockquote:border-l-4 prose-blockquote:border-primary",
        "prose-blockquote:bg-primary/5 dark:prose-blockquote:bg-primary/10",
        "prose-blockquote:py-3 prose-blockquote:px-6",
        "prose-blockquote:rounded-r-lg",
        "prose-blockquote:not-italic",
        "prose-blockquote:text-gray-800 dark:prose-blockquote:text-gray-200",
        "prose-ul:my-4 prose-ol:my-4",
        "prose-li:text-gray-700 dark:prose-li:text-gray-300",
        "prose-li:marker:text-primary",
        "prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800",
        "prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded",
        "prose-code:font-mono prose-code:text-primary",
        "prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950",
        "prose-pre:border prose-pre:border-gray-800 dark:prose-pre:border-gray-700",
        "prose-pre:rounded-lg prose-pre:p-4",
        "prose-pre:overflow-x-auto",
        "prose-img:rounded-lg prose-img:shadow-lg prose-img:my-6",
        "prose-img:border prose-img:border-gray-200 dark:prose-img:border-gray-700",
        "prose-figure:my-6",
        "prose-figcaption:text-sm prose-figcaption:text-gray-500 dark:prose-figcaption:text-gray-400",
        "prose-figcaption:text-center prose-figcaption:italic",
        "prose-hr:border-gray-200 dark:prose-hr:border-gray-700 prose-hr:my-8",
        "prose-table:w-full prose-table:my-6",
        "prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:font-semibold",
        "prose-th:p-3 prose-td:p-3",
        "prose-th:border prose-th:border-gray-200 dark:prose-th:border-gray-700",
        "prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700",
        "dark:prose-invert",
        "prose-first-letter:text-5xl sm:prose-first-letter:text-6xl",
        "prose-first-letter:font-bold prose-first-letter:float-left",
        "prose-first-letter:mr-2 prose-first-letter:leading-none",
        "prose-first-letter:text-primary",
        className
      )}
      dangerouslySetInnerHTML={{ __html: blog.content }}
    />
  );
}
