'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, Book } from 'lucide-react';

interface Doc {
  id: string;
  slug: string;
  title: string;
  category: string;
}

interface GroupedDocs {
  [category: string]: Doc[];
}

export default function DocsSidebar() {
  const pathname = usePathname();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await fetch('/api/docs?ps=100');
        const result = await response.json();
        const fetchedDocs = result.data || [];
        setDocs(fetchedDocs);

        // Auto-expand categories
        const categories = new Set(fetchedDocs.map((doc: Doc) => doc.category));
        setExpandedCategories(categories as Set<string>);
      } catch (error) {
        console.error('Error fetching docs:', error);
      }
    };

    fetchDocs();
  }, []);

  const groupedDocs: GroupedDocs = docs.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as GroupedDocs);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <nav className="space-y-6">
      <div className="mb-6">
        <Link
          href="/docs"
          className="flex items-center gap-2 text-lg font-semibold hover:text-primary transition-colors"
        >
          <Book size={20} />
          Documentation
        </Link>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedDocs).map(([category, categoryDocs]) => {
          const isExpanded = expandedCategories.has(category);

          return (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className="flex items-center justify-between w-full text-left font-semibold text-sm uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors mb-2"
              >
                <span>{category}</span>
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>

              {isExpanded && (
                <ul className="space-y-1 ml-2 border-l-2 border-border pl-4">
                  {categoryDocs.map(doc => {
                    const isActive = pathname === `/docs/${doc.slug}`;

                    return (
                      <li key={doc.id}>
                        <Link
                          href={`/docs/${doc.slug}`}
                          className={`
                            block py-2 px-3 rounded-md text-sm transition-colors
                            ${isActive
                              ? 'bg-primary text-primary-foreground font-medium'
                              : 'text-foreground hover:bg-muted hover:text-primary'
                            }
                          `}
                        >
                          {doc.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
