import { MouseEvent, ReactNode, SVGProps } from 'react';
import styled from 'styled-components';
import { SearchIcon } from './SearchIcon';

export type Item<T> = T & { [key: string]: any };

export interface ResultsProps<T> {
  results: Item<T>[];
  onClick: Function;
  highlightedItem: number;
  setHighlightedItem: Function;
  setSearchString: Function;
  formatResult?: Function;
  searchIcon?: SVGProps<SVGSVGElement> | null;
  maxResults: number;
  resultStringKeyName: string;
  showNoResultsFlag?: boolean;
  showNoResultsText?: string;
}

export default function Results<T>({
  results = [] as any,
  onClick,
  setSearchString,
  searchIcon,
  maxResults,
  resultStringKeyName = 'name',
  highlightedItem,
  setHighlightedItem,
  formatResult,
  showNoResultsFlag = true,
  showNoResultsText = 'No results',
}: ResultsProps<T>) {
  type WithStringKeyName = T & Record<string, unknown>;

  const formatResultWithKey = formatResult
    ? formatResult
    : (item: WithStringKeyName) => item[resultStringKeyName];

  const handleClick = (result: WithStringKeyName) => {
    onClick(result);
    setSearchString(result[resultStringKeyName]);
  };

  const handleMouseDown = ({
    event,
    result,
  }: {
    event: MouseEvent<HTMLLIElement>;
    result: WithStringKeyName;
  }) => {
    if (event.button === 0) {
      event.preventDefault();
      handleClick(result);
    }
  };

  if (showNoResultsFlag) {
    return (
      <ResultsWrapper>
        <li data-test='no-results-message'>
          {searchIcon && <SearchIcon showIcon={true} />}
          <div className='ellipsis'>{showNoResultsText}</div>
        </li>
      </ResultsWrapper>
    );
  }

  if (results?.length <= 0 && !showNoResultsFlag) {
    return null;
  }

  return (
    <ResultsWrapper>
      {results.slice(0, maxResults).map((result, index) => (
        <li
          className={highlightedItem === index ? 'selected' : ''}
          onMouseEnter={() => setHighlightedItem({ index })}
          data-test='result'
          key={`rsa-result-${result.id}`}
          onMouseDown={(event) => handleMouseDown({ event, result })}
          onClick={() => handleClick(result)}
        >
          {searchIcon && <SearchIcon showIcon={true} />}
          <div
            className='ellipsis'
            title={result[resultStringKeyName] as string}
          >
            {formatResultWithKey(result)}
          </div>
        </li>
      ))}
    </ResultsWrapper>
  );
}

const ResultsWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <StyledResults>
      <div className='line' />
      <ul>{children}</ul>
    </StyledResults>
  );
};

const StyledResults = styled.div`
  > div.line {
    border-top-color: ${(props: any) => props.theme.lineColor};
    border-top-style: solid;
    border-top-width: 1px;

    margin-bottom: 0px;
    margin-left: 14px;
    margin-right: 20px;
    margin-top: 0px;

    padding-bottom: 4px;
  }

  > ul {
    list-style-type: none;
    margin: 0;
    padding: 0px 0 16px 0;
    max-height: ${(props: any) => props.theme.maxHeight};

    > li {
      display: flex;
      align-items: center;
      padding: 8px 0;
      cursor: pointer;

      > div {
        margin-left: 13px;
      }
    }
  }

  .ellipsis {
    text-align: left;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .selected {
    background-color: ${(props: any) => props.theme.hoverBackgroundColor};
  }
`;
