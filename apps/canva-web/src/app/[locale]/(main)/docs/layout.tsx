import DocsLayout from '@canva-web/src/components/docs/DocsLayout';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Documentation',
  description: 'Comprehensive documentation and guides',
};

interface DocsLayoutWrapperProps {
  children: ReactNode;
}

export default function DocsLayoutWrapper({ children }: DocsLayoutWrapperProps) {
  return <DocsLayout>{children}</DocsLayout>;
}
