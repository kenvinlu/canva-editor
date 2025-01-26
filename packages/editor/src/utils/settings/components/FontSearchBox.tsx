import { FC } from 'react';
import { SearchBox } from 'canva-editor/search-autocomplete';
import SearchIcon from 'canva-editor/icons/SearchIcon';

interface Props {
  onSearch: (keyword: string) => void;
}
const FontSearchBox: FC<Props> = ({ onSearch }) => {
  return (
    <SearchBox
      items={[]}
      svgIcon={<SearchIcon />}
      onSearch={onSearch}
      autoFocus
      showNoResults={false}
      styling={{ zIndex: 2 }}
      placeholder='Search fonts'
    />
  );
};

export default FontSearchBox;
