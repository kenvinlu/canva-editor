import PageContainer from "@canva-web/src/components/PageContainer";
import SearchProjects from "@canva-web/src/components/project/SearchProjects";
import TemplateSection from "@canva-web/src/components/template/TemplateSection";
import ProjectPageSkeleton from "@canva-web/src/components/project/ProjectPageSkeleton";
import { fetchProjects } from "@canva-web/src/services/project.service";
import { fetchMasterTemplates } from "@canva-web/src/services/template.service";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function ProjectListPage({ searchParams }: { searchParams: Promise<{ page?: string, kw?: string }> }) {
  const { page, kw } = await searchParams;
  const limit = 8;

  const [projects, templateResult] = await Promise.all([
    fetchProjects(parseInt(page || '1', 10), limit, kw || ''),
    fetchMasterTemplates(1, 8),
  ]);
  console.log(projects)
  if (!projects?.data) {
    return notFound();
  }
  const templates = templateResult?.data || [];

  return (
    <PageContainer>
      <Suspense fallback={<ProjectPageSkeleton />}>
        <SearchProjects projects={projects.data || []} totalItems={projects?.meta?.pagination?.total || 0} limit={limit} />
        <TemplateSection templates={templates} />
      </Suspense>
    </PageContainer>
  );
}