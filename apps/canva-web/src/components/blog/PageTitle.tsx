import { ReactNode } from 'react';
import { cn } from '@canva-web/src/utils';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function PageTitle({ children, className }: Props) {
  return (
    <h1 className={cn(
      "text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100",
      "leading-tight sm:leading-tight md:leading-tight",
      "mb-4",
      className
    )}>
      {children}
    </h1>
  );
}
