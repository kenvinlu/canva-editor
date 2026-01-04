import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { useEditor } from 'canva-editor/hooks';
import CloseSidebarButton from 'canva-editor/layout/sidebar/CloseButton';
import useMobileDetect from 'canva-editor/hooks/useMobileDetect';
import Draggable from 'canva-editor/layers/core/Dragable';
import { Delta, ImageData } from 'canva-editor/types';
import apiClient from 'canva-editor/services/base-request';
import { getBestImageFormat } from 'canva-editor/utils/image';
import CloseIcon from 'canva-editor/icons/CloseIcon';
import { useTranslate } from 'canva-editor/contexts/TranslationContext';

interface UploadContentProps {
  visibility: boolean;
  onClose: () => void;
}

interface ImageProps {
  id: number;
  documentId: string;
  url: string;
  type: string;
}

const UploadContentTab: FC<UploadContentProps> = ({ visibility, onClose }) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { actions, config } = useEditor();
  const isMobile = useMobileDetect();
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImageProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [removingImages, setRemovingImages] = useState<Set<string>>(new Set());
  const t = useTranslate();
  useEffect(() => {
    const fetchUserImages = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(
          `${config.apis.url}${config.apis.fetchUserImages}`
        );
        setImages(
          response.data.map((img: any) => ({
            id: img.id,
            documentId: img.documentId,
            url: getBestImageFormat(img.img).url,
            type: img.img.mime,
          }))
        );
      } catch (err) {
        setError(t('sidebar.upload.failedToFetchImages', 'Failed to fetch images'));
        console.error('Fetch images error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserImages();
  }, []);

  const addImage = async (url: string, position?: Delta) => {
    try {
      const img = new Image();
      img.onerror = () => setError(t('sidebar.upload.errorLoadingImage', 'Error loading image'));
      img.src = url;
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        actions.addImageLayer(
          { url, thumb: url, position },
          { width: img.naturalWidth, height: img.naturalHeight }
        );
        if (isMobile) {
          onClose();
        }
      };
    } catch (err) {
      setError(t('sidebar.upload.errorAddingImage', 'Error adding image'));
      console.error('Add image error:', err);
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post<
        { id: number; documentId: string; img: ImageData }[]
      >(`${config.apis.url}${config.apis.uploadUserImage}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      throw new Error(t('sidebar.upload.failedToUploadImage', `Failed to upload ${file.name}`));
    }
  };

  const removeImage = async (imageId: string) => {
    if (!window.confirm(t('sidebar.upload.removeImageMessage', 'Are you sure you want to remove this image?'))) {
      return;
    }
    try {
      setRemovingImages((prev) => new Set(prev).add(imageId));
      await apiClient.delete(
        `${config.apis.url}${config.apis.removeUserImage}/${imageId}`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      setImages((prev) => prev.filter((img) => img.documentId !== imageId));
    } catch (err) {
      setError(t('sidebar.upload.failedToRemoveImage', 'Failed to remove image'));
      console.error('Remove image error:', err);
    } finally {
      setRemovingImages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(imageId);
        return newSet;
      });
    }
  };

  const processFiles = async (files: FileList) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith('image/')
    );
    if (imageFiles.length === 0) {
      setError(t('sidebar.upload.pleaseUploadImageFilesOnly', 'Please upload image files only.'));
      return;
    }

    setLoading(true);
    let processedCount = 0;
    const totalFiles = imageFiles.length;

    for (const file of imageFiles) {
      try {
        const uploadedImage = await uploadImage(file);
        if (uploadedImage.length > 0) {
          uploadedImage.forEach((image) => {
            setImages((prevState) => [
              ...prevState,
              {
                id: image.id,
                documentId: image.documentId,
                url: getBestImageFormat(image.img).url,
                type: image.img.mime,
              },
            ]);
          });
        }
        processedCount++;
      } catch (err) {
        setError(err.message);
        processedCount++;
      } finally {
        if (processedCount === totalFiles) {
          setLoading(false);
        }
      }
    }
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
      // Clear the file input after processing
      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
      // Clear the file input after processing (in case it was set)
      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    if (!loading) {
      inputFileRef.current?.click();
    }
  };

  return (
    <div
      css={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        overflowY: 'auto',
        display: visibility ? 'flex' : 'none',
      }}
    >
      {!isMobile && <CloseSidebarButton onClose={onClose} />}
      <div
        css={{
          margin: 16,
          position: 'relative',
        }}
      >
        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          css={{
            border: isDragging ? '2px dashed #007bff' : '2px dashed #ccc',
            borderRadius: 4,
            padding: 20,
            textAlign: 'center',
            backgroundColor: isDragging ? '#e6f3ff' : '#f9f9f9',
            color: '#333',
            fontSize: 16,
            fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            minHeight: 100,
          }}
        >
          {loading ? (
            <span css={{ fontSize: 14 }}>{t('sidebar.upload.uploading', 'Uploading...')}</span>
          ) : (
            <>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#274856"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                css={{ marginBottom: 4 }}
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span css={{ fontSize: 14 }}>
                {t('sidebar.upload.clickToSelectOrDragAndDropImages', 'Click to select or drag and drop images')}
              </span>
            </>
          )}
        </div>
      </div>
      <input
        ref={inputFileRef}
        type="file"
        accept="image/*"
        multiple
        css={{ display: 'none' }}
        onChange={handleUpload}
      />

      {error && (
        <div css={{ padding: 16, color: 'red', textAlign: 'center' }}>
          {error}
        </div>
      )}
      <div css={{ padding: '16px' }}>
        {images.length === 0 ? (
          <div css={{ textAlign: 'center', color: '#666', fontSize: 14 }}>
            {t('sidebar.upload.noImagesAvailable', 'No images available')}
          </div>
        ) : (
          <div
            css={{
              flexGrow: 1,
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gridGap: 8,
            }}
          >
            {images.map((item) => (
              <div key={item.documentId}>
                <Draggable
                  onDrop={(pos) => {
                    if (pos) {
                      addImage(item.url, pos);
                    }
                  }}
                  onClick={() => {
                    addImage(item.url);
                  }}
                >
                  <div
                    className="image-container"
                    css={{
                      cursor: 'pointer',
                      position: 'relative',
                      width: '100%',
                    }}
                  >
                    <div
                      css={{
                        paddingBottom: '100%',
                        height: 0,
                        position: 'relative',
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(item.documentId);
                        }}
                        disabled={removingImages.has(item.documentId)}
                        css={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          zIndex: 10,
                          border: '1px solid rgba(0, 0, 0, 0.7)',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: removingImages.has(item.documentId)
                            ? 'not-allowed'
                            : 'pointer',
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          '.image-container:hover &': {
                            opacity: 1,
                          },
                          '.image-container.dragging &': {
                            opacity: 0,
                          },
                        }}
                      >
                        <CloseIcon />
                      </button>
                    </div>
                    <div
                      css={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {removingImages.has(item.documentId) ? (
                        <div
                          css={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            fontSize: 14,
                          }}
                        >
                          {t('sidebar.upload.removing', 'Removing...')}
                        </div>
                      ) : (
                        <img
                          src={item.url}
                          loading="lazy"
                          css={{ maxHeight: '100%' }}
                        />
                      )}
                    </div>
                  </div>
                </Draggable>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadContentTab;
