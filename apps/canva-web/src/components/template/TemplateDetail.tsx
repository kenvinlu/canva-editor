'use client';
import React, { useState } from 'react';
import { CalendarClock, ImageIcon } from 'lucide-react';
import { Template } from '../../models/template.model';
import { ImageLarge } from '../base/image';
import { createProject } from '../../services/project.service';
import { useUserStore } from '@canva-web/src/store/useUserStore';
import { useRouter } from 'next/navigation';
import TemplateDialogCard from './TemplateDialogCard';
import { getBestImageFormat } from '@canva-web/src/utils/image';
import { Button } from '../base/button/Button';

const TemplateDetail: React.FC<{
  template: Template;
  recentTemplates: Template[];
}> = ({ template, recentTemplates }) => {
  const user = useUserStore((state) => state.userData);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const router = useRouter();
  const image = getBestImageFormat(template.img);
  const imageProps: {
    src: string;
    alt: string;
    priority: boolean;
  } = {
    src: image?.url,
    alt: template.desc,
    priority: true,
  };  

  const handleCreateProject = async () => {
    if (isCreatingProject) return;

    setIsCreatingProject(true);
    try {
      if (!user) {
        router.push(
          `/sign-in?redirectTo=${encodeURIComponent(window.location.pathname)}`
        );
        return;
      }
      const project = await createProject(template.id);
      if (!project?.data) {
        console.error('Failed to create project');
        setIsCreatingProject(false);
        return;
      }
      router.push(`/design/${project.data.documentId}`);
    } catch (error) {
      console.error(error);
      setIsCreatingProject(false);
    }
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border bg-white/95 shadow-lg shadow-black/5">
        <div className="grid gap-6 p-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:p-3 lg:p-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/10 via-transparent to-primary/5" />
            <div className="relative overflow-hidden rounded-xl border bg-muted/30 shadow-sm">
              <ImageLarge {...imageProps} />
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-primary">
                Template
              </p>
              <h2 className="mt-1 text-xl font-semibold leading-snug text-foreground md:text-2xl">
                {template.desc}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
                  <ImageIcon className="h-3 w-3" />
                  <span>{template.data?.dimensions || '500 x 500 px'}</span>
                </span>
                {/* <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
                  <CalendarClock className="h-3 w-3" />
                  <span>
                    Updated {template.updatedAt || 'recently'}
                  </span>
                </span> */}
              </div>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Start from this professionally designed layout and customize colors, text, images,
                and more using the editor in just a few clicks.
              </p>
              {/* <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-muted-foreground">
                  Created: <span className="font-medium text-foreground">
                    {template.createdAt || 'Unknown'}
                  </span>
                </div>
              </div> */}
              <Button
                className="mt-1 w-full rounded-full text-sm font-semibold shadow-sm sm:w-auto sm:px-8"
                onClick={handleCreateProject}
                disabled={isCreatingProject}
                data-testid="template-customize-button"
              >
                {isCreatingProject ? 'Creating project…' : 'Customize this template'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {recentTemplates.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mt-16 mb-4">
            Other templates you might like
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {recentTemplates.map((template) => (
              <TemplateDialogCard
                key={template.documentId}
                template={template}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default TemplateDetail;
