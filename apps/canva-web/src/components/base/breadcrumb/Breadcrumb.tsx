'use client';

import { usePathname } from 'next/navigation';
import ArrowRightIcon from '../../icons/ArrowRightIcon';
import HomeIcon from '../../icons/HomeIcon';
import Link from 'next/link';

export default function Breadcrumb({
  breadcrumbs,
  isShowHome = true,
}: {
  breadcrumbs: { label: string; href: string }[];
  isShowHome?: boolean;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // console.log(pathname, href);
    return pathname === href;
  };

  return (
    <ol className="flex items-center whitespace-nowrap p-2">
      {isShowHome && (
        <li className="inline-flex items-center">
          <Link
            className="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-hidden focus:text-blue-600"
            href="/"
          >
            <HomeIcon className="shrink-0 me-3 size-4" />
            Home
          </Link>
          {breadcrumbs.length > 1 && (
            <ArrowRightIcon className="shrink-0 mx-2 size-4 text-gray-400" />
          )}
        </li>
      )}
      {breadcrumbs.map((breadcrumb, index) => (
        <li key={index} className="inline-flex items-center">
          {index > 0 && (
            <>
              <ArrowRightIcon className="shrink-0 mx-2 size-4 text-gray-400" />
            </>
          )}
          <a
            aria-label={breadcrumb.label}
            className={`flex items-center text-sm ${
              isActive(breadcrumb.href)
                ? 'inline-flex items-center text-sm font-semibold text-gray-800 truncate dark:text-neutral-200'
                : 'text-gray-500 hover:text-blue-600 focus:outline-hidden focus:text-blue-600'
            }`}
            href={breadcrumb.href}
            aria-current={isActive(breadcrumb.href) ? 'page' : undefined}
          >
            {breadcrumb.label}
          </a>
        </li>
      ))}
    </ol>
  );
}
