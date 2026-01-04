import { FC, useState } from 'react';
import { SearchBox } from 'canva-editor/search-autocomplete';
import { useEditor } from 'canva-editor/hooks';
import useMobileDetect from 'canva-editor/hooks/useMobileDetect';
import { createApi } from 'unsplash-js';
import { useTranslate } from 'canva-editor/contexts/TranslationContext';

interface Props {
  searchString: string;
  onStartSearch: (kw: string) => void;
}
const UnsplashImageSearchBox: FC<Props> = ({ searchString, onStartSearch }) => {
  const { config } = useEditor();
  const isMobile = useMobileDetect();
  const [suggestItems, setSuggestItems] = useState([]);
  const t = useTranslate();
  const unsplash = createApi({
    accessKey: config.unsplash.accessKey,
  });
  const handleOnSearch = async (keyword: any) => {
    if (!keyword.trim()) {
      setSuggestItems([]);
      return;
    }

    try {
      // Use Unsplash autocomplete endpoint
      const result = await unsplash.search.getPhotos({
        query: keyword,
        perPage: 10,
      });

      if (result.type === 'success') {
        // Transform autocomplete results to match SearchBox's expected format
        const suggestions = result.response.results.map((item: any) => ({
          id: item.id, // Optional: include additional data if needed
          name: item.alt_description, // Use the query as the suggestion name
        }));
        setSuggestItems([
          {
            id: 'search-for-' + keyword,
            name: keyword,
          },
          ...suggestions,
        ]);
      } else {
        console.error(
          'Error fetching autocomplete suggestions:',
          result.errors
        );
        setSuggestItems([]);
      }
    } catch (error) {
      console.error('Error in autocomplete request:', error);
      setSuggestItems([]);
    }
  };

  const handleOnHover = () => {};

  const handleOnSelect = (item: any) => {
    // the item selected
    onStartSearch(item.name);
  };

  const handleOnFocus = () => {};

  return (
    <SearchBox
      items={suggestItems}
      inputSearchString={searchString}
      placeholder={t('sidebar.searchImage', 'Search image')}
      onSearch={handleOnSearch}
      onHover={handleOnHover}
      onSelect={handleOnSelect}
      onFocus={handleOnFocus}
      onClear={() => onStartSearch('')}
      autoFocus={!isMobile}
      styling={{ zIndex: 2 }}
    />
  );
};

export default UnsplashImageSearchBox;
