import { Suspense } from 'react';
import DocsContent from '@canva-web/src/components/docs/DocsContent';

export default async function DocsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <DocsContent />
    </Suspense>
  );
}
