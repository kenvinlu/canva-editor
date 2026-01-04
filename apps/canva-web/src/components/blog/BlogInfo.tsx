import moment from "moment";
import readingTime from "reading-time";
import { UserPen, Clock, Calendar } from "lucide-react";
import { Article } from "@canva-web/src/models/cms.model";
import { cn } from "@canva-web/src/utils";

type Props = {
  blog: Article;
  className?: string;
};

export default function BlogInfo({ blog, className }: Props) {
  const readingTimeText = readingTime(blog.content || "").text;
  const publishedDate = moment(blog.publishedAt || blog.updatedAt);
  const formattedDate = publishedDate.format("MMMM DD, YYYY");
  const relativeDate = publishedDate.fromNow();

  return (
    <div className={cn("flex flex-wrap items-center gap-4 text-sm", className)}>
      {blog.author && (
        <div className="flex items-center gap-2 group">
          <div className={cn(
            "p-1.5 rounded-full transition-colors",
            className?.includes("text-white") 
              ? "bg-white/20 group-hover:bg-white/30" 
              : "bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30"
          )}>
            <UserPen className={cn(
              "w-3.5 h-3.5",
              className?.includes("text-white") ? "text-white" : "text-primary"
            )} />
          </div>
          <span className={cn(
            "font-medium",
            className?.includes("text-white") 
              ? "text-white" 
              : "text-gray-700 dark:text-gray-300"
          )}>
            {blog.author.name}
          </span>
        </div>
      )}
      
      <div className="flex items-center gap-2 group">
        <div className={cn(
          "p-1.5 rounded-full transition-colors",
          className?.includes("text-white")
            ? "bg-white/20 group-hover:bg-white/30"
            : "bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50"
        )}>
          <Clock className={cn(
            "w-3.5 h-3.5",
            className?.includes("text-white") 
              ? "text-white" 
              : "text-blue-600 dark:text-blue-400"
          )} />
        </div>
        <span>{readingTimeText}</span>
      </div>
      
      <div className="flex items-center gap-2 group" title={formattedDate}>
        <div className={cn(
          "p-1.5 rounded-full transition-colors",
          className?.includes("text-white")
            ? "bg-white/20 group-hover:bg-white/30"
            : "bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50"
        )}>
          <Calendar className={cn(
            "w-3.5 h-3.5",
            className?.includes("text-white")
              ? "text-white"
              : "text-purple-600 dark:text-purple-400"
          )} />
        </div>
        <span>{relativeDate}</span>
      </div>
    </div>
  );
}
