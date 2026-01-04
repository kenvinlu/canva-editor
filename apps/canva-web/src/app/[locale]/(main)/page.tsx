import ProjectSection from '@canva-web/src/components/project/ProjectSection';
import TemplateSection from '@canva-web/src/components/template/TemplateSection';
import { fetchProjects } from '@canva-web/src/services/project.service';
import { fetchMasterTemplates } from '@canva-web/src/services/template.service';
import { getSessionData } from '@canva-web/src/core/actions/session';
import NemoSection from '@canva-web/src/components/NemoSection';
import { fetchArticles } from '@canva-web/src/services/cms.service';
import BlogSection from '@canva-web/src/components/blog/BlogSection';
import FeatureSection from '@canva-web/src/components/FeatureSection';
import CTASection from '@canva-web/src/components/CTASection';
import { getLocale } from 'next-intl/server';

export default async function HomePage() {
  const [{token}, locale] = await Promise.all([getSessionData(), getLocale()]);
  const [projectResult, templateResult, blogResult] = await Promise.all([
    token ? fetchProjects(1, 4) : { data: [] },
    fetchMasterTemplates(1, 8),
    fetchArticles(1, 4, '', locale),
  ]);

  const projects = projectResult?.data || [];
  const templates = templateResult?.data || [];
  const blogs = blogResult?.data || [];

  return (
    <>
      <NemoSection />

      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProjectSection projects={projects} />
        </div>
      </section>
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <TemplateSection templates={templates} />
        </div>
      </section>
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BlogSection blogs={blogs} />
        </div>
      </section>

      <section id="features" className="py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FeatureSection />
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTASection />
        </div>
      </section>
    </>
  );
}
