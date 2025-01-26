import EditorButton from 'canva-editor/components/EditorButton';
import styled, { useTheme } from 'styled-components';

export const ClearIcon = ({
  showClear,
  setSearchString,
  searchString,
  setFocus,
  onClear,
}: {
  showClear: boolean;
  setSearchString: Function;
  searchString: string;
  setFocus: Function;
  onClear: Function;
}) => {
  const handleClearSearchString = () => {
    setSearchString({ target: { value: '' } });
    setFocus();
    onClear();
  };

  if (!showClear) {
    return null;
  }

  if (!searchString || searchString?.length <= 0) {
    return null;
  }

  return (
    <EditorButton onClick={handleClearSearchString} css={{
      margin: useTheme().clearIconMargin
    }}>
      <StyledClearIcon className='clear-icon'>
        <svg
          width={12}
          height={12}
          focusable='false'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
        >
          <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.58 12 5 17.58 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'></path>
        </svg>
      </StyledClearIcon>
    </EditorButton>
  );
};

const StyledClearIcon = styled.div`
  background-color: grey;
  border-radius: 50%;
  padding: 2px;
  &:hover {
    cursor: pointer;
  }

  > svg {
    fill: ${(props: any) => props.theme.iconColor};
  }
`;
