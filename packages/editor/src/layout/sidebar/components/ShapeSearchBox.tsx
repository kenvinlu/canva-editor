import { FC, useState } from 'react';
import { SearchBox } from 'canva-editor/search-autocomplete';
import axios from 'axios';
import { useEditor } from 'canva-editor/hooks';
import useMobileDetect from 'canva-editor/hooks/useMobileDetect';

interface Props {
  onStartSearch: (kw: string) => void;
}
const ShapeSearchBox: FC<Props> = ({ onStartSearch }) => {
  const { config } = useEditor();
  const isMobile = useMobileDetect();
  const [suggestItems, setSuggestItems] = useState([]);
  const handleOnSearch = async (keyword: any) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    const response = await axios.get(`${config.apis.url}${config.apis.shapeKeywordSuggestion}?kw=` + keyword);
    setSuggestItems(response?.data || []);
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
      placeholder={config.placeholders?.searchShape || 'Search shapes'}
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

export default ShapeSearchBox;
