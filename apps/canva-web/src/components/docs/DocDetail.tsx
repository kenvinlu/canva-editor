'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Folder } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Doc {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  content: string;
  updatedAt: string;
}

interface DocDetailProps {
  slug: string;
}

export default function DocDetail({ slug }: DocDetailProps) {
  const [doc, setDoc] = useState<Doc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/docs/${slug}`);

        if (!response.ok) {
          throw new Error('Document not found');
        }

        const result = await response.json();
        setDoc(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-12 bg-muted rounded w-3/4" />
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Document Not Found</h2>
        <p className="text-muted-foreground mb-6">{error || 'The requested document could not be found.'}</p>
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Documentation
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(doc.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        href="/docs"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Documentation
      </Link>

      {/* Document Header */}
      <div className="mb-8 pb-8 border-b border-border">
        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Folder size={16} />
            {doc.category}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            Updated {formattedDate}
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">{doc.title}</h1>
        <p className="text-lg text-muted-foreground">{doc.description}</p>
      </div>

      {/* Document Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-bold mt-6 mb-3 text-foreground">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-bold mt-4 mb-2 text-foreground">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="mb-4 text-foreground leading-relaxed">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-4 space-y-2 text-foreground">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-4 space-y-2 text-foreground">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="ml-4 text-foreground">{children}</li>
            ),
            code: ({ className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              const inline = !match;

              return inline ? (
                <code
                  className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground"
                  {...props}
                >
                  {children}
                </code>
              ) : (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-lg mb-4 overflow-x-auto"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              );
            },
            a: ({ href, children }) => (
              <Link
                href={href || '#'}
                className="text-primary hover:underline font-medium"
              >
                {children}
              </Link>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                {children}
              </blockquote>
            ),
          }}
        >
          {doc.content}
        </ReactMarkdown>
      </div>

      {/* Navigation Footer */}
      <div className="mt-12 pt-8 border-t border-border">
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
        >
          <ArrowLeft size={16} />
          Back to Documentation
        </Link>
      </div>
    </div>
  );
}
