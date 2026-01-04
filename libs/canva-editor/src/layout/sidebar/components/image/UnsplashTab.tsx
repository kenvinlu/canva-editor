import { useEditor } from 'canva-editor/hooks';
import { FC, useEffect, useRef, useState } from 'react';
import { createApi } from 'unsplash-js';
import Draggable from 'canva-editor/layers/core/Dragable';
import { Delta } from 'canva-editor/types';
import UnsplashImageSearchBox from '../UnsplashImageSearchBox';
import Masonry from 'react-masonry-css';
import styles from './sidebar-image.module.css';

const UnsplashTab: FC = () => {
  const { actions, config } = useEditor();
  const [query, setQuery] = useState('nature');
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(config.unsplash.pageSize);
  const [order, setOrder] = useState('popular');
  const [error, setError] = useState<string | null>(null);
  const [columnWidth, setColumnWidth] = useState(0);
  const gridRef = useRef(null);
  
  useEffect(() => {
    if (gridRef.current) {
      const columnWidth = gridRef.current.offsetWidth / 2;
      setColumnWidth(columnWidth);
    }
  }, []);
  
  const unsplash = createApi({
    accessKey: config.unsplash.accessKey,
  });

  const fetchPhotos = async () => {
    setIsLoading(true);
    unsplash.search
      .getPhotos({
        query,
        page,
        perPage,
      })
      .then((result) => {
        if (result.type === 'success') {
          setPhotos(result.response?.results || []);
        } else {
          setError(result.errors[0] || 'An error occurred');
        }
      })
      .catch(setError)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPhotos();
  }, [query, page, perPage, order]);

  const handleSearch = (kw: string) => {
    setQuery(kw);
  };

  const addImage = async (thumb: string, url: string, position?: Delta) => {
    const img = new Image();
    img.onerror = (err) => {
      console.error(err);
    };
    img.src = url;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      actions.addImageLayer(
        { thumb, url, position },
        { width: img.naturalWidth, height: img.naturalHeight }
      );
    };
  };

  return (
    <div
      css={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        overflowY: 'hidden',
        display: 'flex',
      }}
    >
      <UnsplashImageSearchBox
        searchString={query}
        onStartSearch={handleSearch}
      />

      {isLoading && (
        <div css={{ textAlign: 'center', margin: '10px 0' }}>Loading...</div>
      )}
      {/* {error && (
        <div css={{ textAlign: 'center', color: 'red' }}>
          {error}
        </div>
      )} */}
      <div
        css={{
          flex: 1,
          overflowY: 'auto',
          paddingTop: 8,
          marginBottom: 8,
        }}
        ref={gridRef}
      >
        <Masonry
          breakpointCols={{ default: 2, 700: 1 }}
          className={styles['unsplash-grid']}
          columnClassName={styles['unsplash-grid_column']}
        >
          {photos.map((photo) => {
            const height = photo.height * (columnWidth / photo.width) - 8; // 8px is the gap between images
            return (
              <Draggable
                key={photo.id}
                onDrop={(pos) => {
                  if (pos) {
                    addImage(photo.urls.small, photo.urls.regular, pos);
                  }
                }}
                onClick={() => {
                  addImage(photo.urls.small, photo.urls.regular);
                }}
                height={height}
                gap={10}
              >
                <div
                  css={{
                    position: 'relative',
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                >
                  <img
                    css={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      objectFit: 'cover',
                    }}
                    src={photo.urls.small}
                    alt={photo.alt_description || 'Unsplash Image'}
                  />
                  <p
                    css={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      margin: 0,
                      padding: '8px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: '#fff',
                      fontSize: '12px',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      textAlign: 'center',
                      'img:hover + &': {
                        opacity: 1,
                      },
                    }}
                  >
                    Photo by{' '}
                    <a
                      href={photo.user.links.html}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {photo.user.name}
                    </a>{' '}<br />
                    on{' '}
                    <a
                      href="https://unsplash.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Unsplash
                    </a>
                  </p>
                </div>
              </Draggable>
            );
          })}
        </Masonry>
      </div>
    </div>
  );
};

export default UnsplashTab;