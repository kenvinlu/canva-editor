'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { SearchIcon, X } from 'lucide-react';
import { Button } from '../button/Button';

export default function Search({
  placeholder,
  paramName = 'kw',
}: {
  placeholder: string;
  paramName?: string;
}) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    params.set('page', '1');

    if (term) {
      params.set(paramName, term);
    } else {
      params.delete(paramName);
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleClear = () => {
    const params = new URLSearchParams(searchParams);
    params.delete(paramName);
    replace(`${pathname}?${params.toString()}`);
    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
  };

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="search-input peer block w-full rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-[11px] pl-11 pr-10 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get(paramName)?.toString()}
      />
      <SearchIcon className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500 peer-focus:text-primary transition-colors" />
      {searchParams.get(paramName) && (
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleClear} 
          className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 border-none hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
