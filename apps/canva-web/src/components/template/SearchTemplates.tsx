'use client';

import { Template } from "../../models/template.model";
import TemplateDialogCard from "./TemplateDialogCard";
import Pagination from "../base/pagination/Pagination";
import Search from "../base/search/Search";
import TopPageCard from "../card/top-card/TopPageCard";

type Props = {
  templates: Template[];
  totalItems: number;
  limit: number;
};

export default function SearchTemplates({ templates = [], totalItems, limit }: Props) {
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <section className="mb-16">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <TopPageCard
          title="Design templates"
          subTitle="Browse professionally designed templates and start customizing in seconds."
          searchBox={<Search placeholder="Search templates by name, size, or use case" />}
        />
        {templates.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border bg-muted/40 px-6 py-12 text-center">
            <p className="text-lg font-medium">No templates found</p>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Try adjusting your search terms or browsing from the home page to discover more design templates.
            </p>
          </div>
        ) : (
          <div
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 h-full"
            data-testid="templates-container"
          >
            {templates.map((template) => (
              <TemplateDialogCard key={template.documentId} template={template} />
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination totalPages={totalPages} />
          </div>
        )}
      </div>
    </section>
  );
}