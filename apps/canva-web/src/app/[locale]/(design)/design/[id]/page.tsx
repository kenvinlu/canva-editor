import { fetchUserProjectById } from '@canva-web/src/services/project.service';
import DesignPageClient from './client';
import { notFound } from 'next/navigation';
import { getSessionData } from '@canva-web/src/core/actions/session';
import { getMessages } from 'next-intl/server';

export const dynamic = 'force-dynamic';

async function DesignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  if (!id) {
    return <div>No project id provided</div>;
  }

  const [project, { token = '' }, messages] = await Promise.all([
    fetchUserProjectById(id),
    getSessionData(),
    getMessages(),
  ]);

  if (!project?.data) {
    return notFound();
  }

  return <DesignPageClient project={project.data} token={token} messages={messages} />;
}

export default DesignPage;
