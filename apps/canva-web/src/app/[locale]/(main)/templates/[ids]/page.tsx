import { fetchTemplateById } from '@canva-web/src/services/template.service';
import { notFound } from 'next/navigation';
import TemplateDetail from '@canva-web/src/components/template/TemplateDetail';
import Breadcrumb from '@canva-web/src/components/base/breadcrumb/Breadcrumb';
import { fetchRecentTemplates } from '@canva-web/src/services/template.service';
import PageContainer from '@canva-web/src/components/PageContainer';
export default async function TemplatePage({
  params,
}: {
  params: Promise<{ ids: string }>;
}) {
  const { ids } = await params;
  const [documentId, id] = decodeURIComponent(ids).split('|');
  if (!documentId || !id) {
    return notFound();
  }
  const [template, recentTemplates] = await Promise.all([
    fetchTemplateById(documentId),
    fetchRecentTemplates(Number(id)),
  ]);

  if (!template?.data) {
    return notFound();
  }

  return (
    <PageContainer>
      <div className="mb-8">
        <Breadcrumb
          breadcrumbs={[
            { label: 'Templates', href: '/templates' },
            {
              label: template.data.title || template.data.desc,
              href: `/templates/${encodeURIComponent(
                template.data.documentId + '|' + template.data.id
              )}`,
            },
          ]}
        />
      </div>
      <div data-testid="template-detail-page">
        <TemplateDetail
          template={template.data}
          recentTemplates={recentTemplates?.data || []}
        />
      </div>
    </PageContainer>
  );
}
