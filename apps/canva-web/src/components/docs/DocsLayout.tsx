'use client';

import { ReactNode, useState } from 'react';
import { Menu, X } from 'lucide-react';
import DocsSidebar from './DocsSidebar';

interface DocsLayoutProps {
  children: ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 relative">
          {/* Sidebar Toggle Button (Mobile) */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden fixed top-20 left-4 z-50 p-2 rounded-md bg-background border border-border shadow-lg hover:bg-accent transition-colors"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Sidebar */}
          <aside
            className={`
              fixed lg:sticky top-20 left-0 h-[calc(100vh-5rem)]
              w-64 lg:w-72 shrink-0
              bg-background lg:bg-transparent
              border-r border-border lg:border-0
              transition-transform duration-300 ease-in-out
              z-40 lg:z-auto
              overflow-y-auto
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            <div className="p-6 lg:pr-8">
              <DocsSidebar />
            </div>
          </aside>

          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/20 z-30"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
