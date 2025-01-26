import {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Sidebar, { SidebarProps } from './Sidebar';
import { FontData, FontDataApi, GetFontQuery } from 'canva-editor/types';
import { useUsedFont } from 'canva-editor/hooks/useUsedFont';
import { useEditor } from 'canva-editor/hooks';
import CheckIcon from 'canva-editor/icons/CheckIcon';
import ArrowRightIcon from 'canva-editor/icons/ArrowRightIcon';
import ArrowDownIcon from 'canva-editor/icons/ArrowDownIcon';
import styled from '@emotion/styled';
import {
  groupFontsByFamily,
  handleFontStyle,
  handleFontStyleName,
} from 'canva-editor/utils/fontHelper';
import { getRandomItems } from 'canva-editor/utils';
import FontStyle from './FontStyle';
import { isArray, some } from 'lodash';
import FontSearchBox from '../components/FontSearchBox';
import TrendingIcon from 'canva-editor/icons/TrendingIcon';
import DocumentIcon from 'canva-editor/icons/DocumentIcon';
import HorizontalCarousel from 'canva-editor/components/carousel/HorizontalCarousel';
import OutlineButton from 'canva-editor/components/button/OutlineButton';
import axios from 'axios';
import useMobileDetect from 'canva-editor/hooks/useMobileDetect';
import CloseIcon from 'canva-editor/icons/CloseIcon';

const ListItem = styled('div')`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0 12px;
  :hover: {
    background: #f9f9f9;
  }

  > span:nth-of-type(1) {
    flex: 0 1 auto;
    width: 24px;
    margin: 6px 8px 0 0;
    color: rgb(169 169 173);
  }

  > span:nth-of-type(2) {
    margin-right: auto;
    font-size: 16px;
  }
`;

const FontDisplay = styled('span')<{ fontStyle: string }>(
  ({ fontStyle }) => `
    text-transform: capitalize;
    ${handleFontStyle(fontStyle)};
`
);

const flatFonts = (fonts: FontDataApi[]): FontData[] => {
  return fonts.reduce((acc: FontData[], font: FontDataApi) => {
    return acc.concat(
      font.styles.map((s) => {
        return {
          family: font.family,
          name: s.name,
          url: s.url,
          style: s.style,
        };
      })
    );
  }, []);
};
interface FontSidebarProps extends SidebarProps {
  selected: FontData[];
  onChangeFontFamily: (font: FontData) => void;
}
const FontSidebar: ForwardRefRenderFunction<
  HTMLDivElement,
  FontSidebarProps
> = ({ selected, onChangeFontFamily, ...props }, ref) => {
  const dataRef = useRef(false);
  const isMobile = useMobileDetect();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { usedFonts } = useUsedFont();
  const { actions, fontList, config } = useEditor((state, config) => ({
    config,
    fontList: useMemo(
      () => groupFontsByFamily(state.fontList),
      [state.fontList]
    ),
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [offset, setOffset] = useState(0);
  const [openingRecentItems, setOpeningRecentItems] = useState<number[]>([]);
  const [openingItems, setOpeningItems] = useState<number[]>([]);
  const [randomFonts, setRandomFonts] = useState<FontData[] | null>(null);
  const getFonts = useCallback((query: GetFontQuery) => {
    const buildParams = (data: Record<string, string | string[]>) => {
      const params = new URLSearchParams();

      Object.entries(data).forEach(([key, value]) => {
        if (isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.append(key, value);
        }
      });

      return params;
    };
    return axios
      .get<FontDataApi[]>(
        `${config.apis.url}${config.apis.searchFonts}?${buildParams(query)}`
      )
      .then((res) => res.data);
  }, []);

  const loadFontList = useCallback(
    async (offset = 0) => {
      dataRef.current = true;
      setIsLoading(true);
      const res = await getFonts({ ps: 30 + '', pi: offset + '', kw: keyword });
      if (offset) {
        actions.appendFontList(flatFonts(res));
      } else {
        actions.setFontList(flatFonts(res));
      }
      setIsLoading(false);
      if (res.length > 0) {
        dataRef.current = false;
      }
    },
    [getFonts, actions, setIsLoading, keyword]
  );

  useEffect(() => {
    loadFontList();
  }, [loadFontList]);

  useEffect(() => {
    if (!randomFonts && fontList.length) {
      setRandomFonts(getRandomItems(fontList));
    }
  }, [fontList]);

  useEffect(() => {
    const handleLoadMore = async (e: Event) => {
      const node = e.target as HTMLDivElement;
      if (
        node.scrollHeight - node.scrollTop - 80 <= node.clientHeight &&
        !dataRef.current
      ) {
        setOffset(offset + 1);
        await loadFontList(offset + 1);
      }
    };

    scrollRef.current?.addEventListener('scroll', handleLoadMore);
    return () => {
      scrollRef.current?.removeEventListener('scroll', handleLoadMore);
    };
  }, [loadFontList]);

  const handleSearch = async (keyword: string) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    setKeyword(keyword);
    await loadFontList(0);
  };

  const handleToggleChildren = (items: number[], itemIndex: number) => {
    const idx = items.indexOf(itemIndex);
    const listIdx = [...items];

    if (idx !== -1) {
      listIdx.splice(idx, 1);
      return listIdx;
    }
    listIdx.push(itemIndex);
    return listIdx;
  };

  const renderHeader = () =>
    isMobile && (
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          height: 48,
          borderBottom: '1px solid rgba(57,76,96,.15)',
          padding: '0 20px',
        }}
      >
        <p
          css={{
            lineHeight: '48px',
            fontWeight: 600,
            color: '#181C32',
            flexGrow: 1,
          }}
        >
          Fonts
        </p>
        <div
          css={{
            fontSize: 20,
            flexShrink: 0,
            width: 32,
            height: 32,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => {
            actions.setSidebar();
          }}
        >
          <CloseIcon />
        </div>
      </div>
    );

  return (
    <Sidebar ref={ref} {...props}>
      <FontStyle />
      <div
        css={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {renderHeader()}
        <div css={{ padding: '16px 16px 0' }}>
          <FontSearchBox onSearch={handleSearch} />
          <div css={{ marginTop: 8 }}>
            {randomFonts && (
              <HorizontalCarousel>
                {randomFonts.map((font, idx) => (
                  <div key={`rdf-` + idx} className='carousel-item'>
                    <OutlineButton onClick={() => onChangeFontFamily(font)}>
                      <FontDisplay
                        css={{
                          fontFamily: `'${font.name}'`,
                        }}
                        fontStyle={font.style}
                      >
                        {!font.styles?.length ? font.name : font.family}
                      </FontDisplay>
                    </OutlineButton>
                  </div>
                ))}
              </HorizontalCarousel>
            )}
          </div>
        </div>
        <div ref={scrollRef} css={{ flexGrow: 1, overflowY: 'auto' }}>
          <div
            css={{
              padding: '16px 16px 8px 8px',
              fontWeight: 700,
              display: 'flex',
              columnGap: 8,
              alignItems: 'center',
            }}
          >
            <DocumentIcon css={{ width: 24 }} />
            <span>Document fonts</span>
          </div>
          {usedFonts.map((font, idx) => (
            <div key={idx + '-' + font.family}>
              <ListItem onClick={() => onChangeFontFamily(font)}>
                <span>
                  {font.styles && font.styles?.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpeningRecentItems(
                          handleToggleChildren(openingRecentItems, idx)
                        );
                      }}
                    >
                      {openingRecentItems.indexOf(idx) === -1 ? (
                        <ArrowRightIcon />
                      ) : (
                        <ArrowDownIcon />
                      )}
                    </button>
                  )}
                </span>
                <FontDisplay
                  css={{
                    fontFamily: `'${font.name}'`,
                  }}
                  fontStyle={font.style}
                >
                  {font.family} ({handleFontStyleName(font.style)})
                </FontDisplay>
                <span></span>
              </ListItem>
              {openingRecentItems.indexOf(idx) > -1 &&
                font.styles &&
                font.styles?.length > 1 &&
                font.styles.map((fontStyle, subIdx) => (
                  <ListItem
                    css={{ marginLeft: 16 }}
                    key={subIdx + '-' + fontStyle.name}
                    onClick={() => onChangeFontFamily(fontStyle)}
                  >
                    <span></span>
                    <FontDisplay
                      css={{
                        fontFamily: `'${fontStyle.name}'`,
                      }}
                      fontStyle={fontStyle.style}
                    >
                      {handleFontStyleName(fontStyle.style)}
                    </FontDisplay>
                    <span></span>
                  </ListItem>
                ))}
            </div>
          ))}
          <div css={{ borderTop: '1px solid rgba(217, 219, 228, 0.6)' }}>
            <div
              css={{
                padding: '16px 16px 8px 8px',
                fontWeight: 700,
                display: 'flex',
                columnGap: 8,
              }}
            >
              <TrendingIcon />
              <span>Popular fonts</span>
            </div>
            {fontList.map((font, idx) => (
              <div key={idx + '-' + font.name}>
                <ListItem onClick={() => onChangeFontFamily(font)}>
                  <span>
                    {font.styles && font.styles?.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpeningItems(
                            handleToggleChildren(openingItems, idx)
                          );
                        }}
                      >
                        {openingItems.indexOf(idx) === -1 ? (
                          <ArrowRightIcon />
                        ) : (
                          <ArrowDownIcon />
                        )}
                      </button>
                    )}
                  </span>
                  <FontDisplay
                    css={{
                      fontFamily: `'${font.name}'`,
                    }}
                    fontStyle={font.style}
                  >
                    {!font.styles?.length ? font.name : font.family}
                  </FontDisplay>
                  <span>
                    {openingItems.indexOf(idx) === -1 &&
                      some(font.styles, (fontStyle) =>
                        selected.map((s) => s.name).includes(fontStyle.name)
                      ) && <CheckIcon />}
                  </span>
                </ListItem>
                {openingItems.indexOf(idx) > -1 &&
                  font.styles &&
                  font.styles?.length > 1 &&
                  font.styles.map((fontStyle, subIdx) => (
                    <ListItem
                      css={{ marginLeft: 16 }}
                      key={subIdx + '-' + fontStyle.name}
                      onClick={() => onChangeFontFamily(fontStyle)}
                    >
                      <span></span>
                      <FontDisplay
                        css={{
                          fontFamily: `'${fontStyle.name}'`,
                        }}
                        fontStyle={fontStyle.style}
                      >
                        {handleFontStyleName(fontStyle.style)}
                      </FontDisplay>
                      <span>
                        {selected
                          .map((s) => s.name)
                          .includes(fontStyle.name) && <CheckIcon />}
                      </span>
                    </ListItem>
                  ))}
              </div>
            ))}
            {isLoading && <div css={{ padding: 16 }}>Loading...</div>}
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default forwardRef<HTMLDivElement, FontSidebarProps>(FontSidebar);
