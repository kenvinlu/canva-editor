"use client";

import * as React from "react";
import { getBestImageFormat } from "@canva-web/src/utils/image";
import { Article } from "@canva-web/src/models/cms.model";
import Image from "next/image";
import { Card, CardContent } from "../base/card/Card";
import { Badge } from "../base/badge/Badge";
import { Clock, User, Calendar } from "lucide-react";
import readingTime from "reading-time";
import moment from "moment";
import { cn } from "@canva-web/src/utils";

type BlogCardProps = {
  blog: Article;
  variant?: "default" | "compact";
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onError">;

export function BlogCard({
  blog,
  className,
}: BlogCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const readingTimeText = readingTime(blog.content || "").text;
  const imageUrl = getBestImageFormat(blog.cover).url;

  return (
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl h-full overflow-hidden transition-all duration-300",
          "hover:shadow-xl hover:shadow-primary/5",
          "group h-full block",
          isHovered && "shadow-xl ring-2 ring-primary/20 border-primary/30 scale-[1.02]",
          className
        )}
      >
        <div className="relative h-48 md:h-56 overflow-hidden bg-gray-100 dark:bg-gray-800">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={blog.title}
              fill
              className={cn(
                "object-cover transition-transform duration-500 ease-out",
                isHovered && "scale-110"
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category badge */}
          {blog.categories && blog.categories.length > 0 && (
            <Badge
              variant="secondary"
              className="absolute left-3 top-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs font-medium"
            >
              {blog.categories[0].name}
            </Badge>
          )}
        </div>

        <CardContent className="flex flex-col flex-1 p-5">
          <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {blog.title}
          </h3>
          
          {blog.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
              {blog.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-auto pt-3 border-t border-gray-200 dark:border-gray-800">
            {blog.author && (
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span className="truncate">{blog.author.name}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{readingTimeText}</span>
            </div>
            {blog.publishedAt && (
              <div className="flex items-center gap-1.5 ml-auto">
                <Calendar className="w-3.5 h-3.5" />
                <span>{moment(blog.publishedAt).format("MMM DD")}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
              {blog.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="text-xs px-2 py-0.5"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
  );
}
