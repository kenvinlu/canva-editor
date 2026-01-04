'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, Book, FileText } from 'lucide-react';
import { Input } from '@canva-web/src/components/base/input/Input';
import { useDebounce } from '@canva-web/src/hooks/useDebounce';

interface Doc {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  updatedAt: string;
}

interface GroupedDocs {
  [category: string]: Doc[];
}

export default function DocsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [docs, setDocs] = useState<Doc[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch all docs on mount
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/docs?ps=100');
        const result = await response.json();
        setDocs(result.data || []);
        setFilteredDocs(result.data || []);
      } catch (error) {
        console.error('Error fetching docs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  // Search and filter
  useEffect(() => {
    const searchDocs = async () => {
      if (debouncedSearch) {
        try {
          const response = await fetch(`/api/docs/search?kw=${encodeURIComponent(debouncedSearch)}&ps=100`);
          const result = await response.json();
          let searchResults = result.data || [];

          if (selectedCategory !== 'all') {
            searchResults = searchResults.filter((doc: Doc) => doc.category === selectedCategory);
          }

          setFilteredDocs(searchResults);
        } catch (error) {
          console.error('Error searching docs:', error);
        }
      } else {
        const filtered = selectedCategory === 'all'
          ? docs
          : docs.filter(doc => doc.category === selectedCategory);
        setFilteredDocs(filtered);
      }
    };

    searchDocs();
  }, [debouncedSearch, selectedCategory, docs]);

  // Group docs by category
  const groupedDocs: GroupedDocs = filteredDocs.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as GroupedDocs);

  const categories = ['all', ...Array.from(new Set(docs.map(doc => doc.category)))];

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Documentation</h1>
      </div>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${selectedCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-foreground'
              }
            `}
          >
            {category === 'all' ? 'All' : category}
          </button>
        ))}
      </div>

      {/* Docs List */}
      {filteredDocs.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h3 className="text-xl font-semibold mb-2">No documents found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedDocs).map(([category, categoryDocs]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Book size={24} />
                {category}
              </h2>
              <div className="grid gap-4">
                {categoryDocs.map(doc => (
                  <Link
                    key={doc.id}
                    href={`/docs/${doc.slug}`}
                    className="group block p-6 rounded-lg border border-border hover:border-primary hover:shadow-lg transition-all duration-200 bg-card"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                          {doc.title}
                          <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                        </h3>
                        <p className="text-muted-foreground">
                          {doc.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
