import PageContainer from "@canva-web/src/components/PageContainer";
import SearchTemplates from "@canva-web/src/components/template/SearchTemplates";
import TemplatePageSkeleton from "@canva-web/src/components/template/TemplatePageSkeleton";
import { fetchMasterTemplates } from "@canva-web/src/services/template.service";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function TemplateListPage({ searchParams }: { searchParams: Promise<{ page?: string, kw?: string }> }) {
  const { page, kw } = await searchParams;
  const limit = 8;
  const templates = await fetchMasterTemplates(parseInt(page || '1', 10), limit, kw || '');
  console.log('templates', templates);
  if (!templates?.data) {
    return notFound();
  }
  
  return (
    <PageContainer>
      <Suspense fallback={<TemplatePageSkeleton />}>
        <SearchTemplates templates={templates.data} totalItems={templates?.meta?.pagination?.total || 0} limit={limit} />
      </Suspense>
    </PageContainer>
  );
}