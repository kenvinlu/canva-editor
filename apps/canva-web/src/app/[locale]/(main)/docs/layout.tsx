import DocsLayout from '@canva-web/src/components/docs/DocsLayout';
import { ReactNode } from 'react';

interface DocsLayoutWrapperProps {
  children: ReactNode;
}

export default function DocsLayoutWrapper({ children }: DocsLayoutWrapperProps) {
  return <DocsLayout>{children}</DocsLayout>;
}
