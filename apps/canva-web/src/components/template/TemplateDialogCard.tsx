'use client';

import React, { useEffect, useState, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import TemplateDetail from './TemplateDetail';
import { Template } from '../../models/template.model';
import { TemplateCard } from './TemplateCard';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Button } from '../base/button/Button';

const TemplateDetailDialog: React.FC<{ template: Template }> = ({
  template,
}) => {
  const [open, setOpen] = useState(false);
  const wasOpen = useRef(false); // Track if dialog was ever opened

  useEffect(() => {
    if (open) {
      // Update URL when dialog opens
      window.history.pushState({}, '', `/templates/${template.documentId}|${template.id}`);
      wasOpen.current = true; // Mark dialog as opened
    } else if (wasOpen.current) {
      // Only go back if dialog was previously opened
      window.history.back();
    }
  }, [open, template.documentId, template.id]);

  // Sync dialog state with browser history
  useEffect(() => {
    const handlePopState = () => {
      // Check if URL matches the template detail route
      const isTemplateRoute = window.location.pathname === `/templates/${template.documentId}|${template.id}`;
      setOpen(isTemplateRoute);
      wasOpen.current = isTemplateRoute; // Update wasOpen based on route
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [template.documentId, template.id]);

  return (
    <Dialog.Root open={open}>
      <Dialog.Trigger asChild>
        <div className="relative">
          <Link
            href={`/templates/${template.documentId}|${template.id}`}
            onClick={(e) => {
              if (e.ctrlKey || e.metaKey) {
                return;
              }
              e.preventDefault();
              setOpen(true);
            }}
          >
            <TemplateCard template={template} className="h-full" />
          </Link>
        </div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 items-stretch rounded-2xl bg-background/95 p-0 text-left shadow-2xl shadow-black/30 outline-none backdrop-blur data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          data-testid="template-detail-dialog"
        >
          <Dialog.Title className="sr-only">
            Template detail
          </Dialog.Title>
          <div className="relative flex-1 overflow-y-auto">
            <TemplateDetail template={template} recentTemplates={[]} />
          </div>

          <Dialog.Close asChild>
            <Button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 h-8 w-8 rounded-full border border-border bg-background/80 p-0 text-gray-600 hover:bg-background hover:text-foreground"
              aria-label="Close"
              variant="outline"
              size="icon"
            >
              <X className="h-4 w-4" />
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default TemplateDetailDialog;