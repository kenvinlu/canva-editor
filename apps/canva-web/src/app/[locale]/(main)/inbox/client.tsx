'use client';

import { InboxSplitView } from '@canva-web/src/components/inbox/InboxSplitView';

export function InboxPageClient() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <InboxSplitView />
      </div>
    </div>
  );
}
