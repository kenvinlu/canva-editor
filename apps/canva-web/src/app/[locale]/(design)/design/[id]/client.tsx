'use client';

import EditorSkeleton from '@canva-web/src/components/skeleton/EditorSkeleton';
import { Project } from '@canva-web/src/models/project.model';
import dynamic from 'next/dynamic';
const DesignEditor = dynamic(
  () =>
    import('@canva-web/src/components/DesignEditor').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  }
);
const DesignPageClient = ({ 
  project, 
  token, 
  messages 
}: { 
  project: Project; 
  token: string; 
  messages: Record<string, unknown>;
}) => {
  return (
    <div data-testid="design-page">
      <DesignEditor project={project} token={token} messages={messages} />
    </div>
  );
};

export default DesignPageClient;
