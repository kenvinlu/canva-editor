import { Suspense } from 'react';
import DocDetail from '@canva-web/src/components/docs/DocDetail';

interface DocsDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function DocsDetailPage({ params }: DocsDetailPageProps) {
  const { slug } = await params;
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <DocDetail slug={slug} />
    </Suspense>
  );
}
