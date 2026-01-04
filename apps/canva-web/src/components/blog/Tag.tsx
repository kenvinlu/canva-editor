import { cx } from '@canva-web/src/utils/blog';
import Link from 'next/link';
import { cn } from '@canva-web/src/utils';

type Props = {
  link?: string;
  name: string;
  className?: string;
};

export default function Tag({ link = '#', name, className }: Props) {
  return (
    <Link
      href={link}
      className={cn(
        'inline-flex items-center justify-center',
        'px-4 py-1.5 sm:px-5 sm:py-2',
        'bg-primary/10 dark:bg-primary/20',
        'text-primary dark:text-primary',
        'rounded-full',
        'text-sm font-medium',
        'border border-primary/20 dark:border-primary/30',
        'hover:bg-primary/20 dark:hover:bg-primary/30',
        'hover:border-primary/40 dark:hover:border-primary/50',
        'hover:scale-105',
        'transition-all duration-200 ease-in-out',
        'capitalize',
        className
      )}
    >
      {name}
    </Link>
  );
}
