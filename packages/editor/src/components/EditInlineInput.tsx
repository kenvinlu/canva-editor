import { Interpolation, Theme } from '@emotion/react';
import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';

type InlineEditProps = {
  text: string;
  onSetText: (text: string) => void;
  placeholder?: string;
  styles?: { placeholderColor: string };
  handleStyle?: (isFocus: boolean) => Interpolation<Theme>;
  inputCss?: Interpolation<Theme>;
  autoRow?: boolean;
  maxLength?: number;
};

const EditInlineInput: React.FC<InlineEditProps> = ({
  text,
  onSetText,
  placeholder = 'Add new text',
  handleStyle,
  styles = { placeholderColor: '#73757b' },
  inputCss = null,
  autoRow = true,
  maxLength = 120
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<any>(null); // HTMLTextAreaElement|HTMLInputElement
  const [textDraft, setTextDraft] = useState('');
  const handleDoubleClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setTextDraft(text);
    setIsEditing(true);
  };
  const overflowStyle = !autoRow ? {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxWidth: 450,
    display: 'block'
  } : {};
  const handleBlur = () => {
    handleSubmit();
  };
  const handleKeyPress = (
    event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (autoRow) {
      (event.target as HTMLTextAreaElement).style.height = 'inherit';
      (event.target as HTMLTextAreaElement).style.height = `${
        (event.target as HTMLTextAreaElement).scrollHeight
      }px`;
    }
    setTextDraft(inputRef.current?.value || '');
    if (event.key === 'Enter') {
      handleSubmit();
    } else if (event.key === 'Escape') {
      setIsEditing(false);
      setTextDraft('');
    }
  };

  const handleSubmit = () => {
    if (inputRef.current?.value.length > maxLength) {
      console.warn('Maximum is ' + maxLength);
      return;
    }
    setIsFocused(false);
    setIsEditing(false);
    setTextDraft('');
    onSetText(inputRef.current?.value || '');
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (autoRow) {
        const scrollHeight = inputRef.current.scrollHeight;
        inputRef.current.style.height = scrollHeight + 'px';
      }
    }
  }, [isEditing]);

  return (
    <div css={handleStyle && handleStyle(isFocused)}>
      <div css={{ minHeight: 18, minWidth: 18 }}>
        {isEditing ? (
          <div
            css={{
              position: 'relative',
              width: '100%',
            }}
          >
            {autoRow ? (
              <textarea
                ref={inputRef}
                defaultValue={text}
                onFocus={() => setIsFocused(true)}
                rows={1}
                onBlur={handleBlur}
                onKeyDown={handleKeyPress}
                css={{
                  position: 'absolute',
                  border: 'none',
                  left: 0,
                  top: 0,
                  borderBottom: '1px dashed #000',
                  backgroundColor: 'transparent',
                  width: '100%',
                  fontWeight: 'bold',
                  color: 'inherit',
                  font: 'inherit',
                  zIndex: 1,
                  resize: 'none',
                  ...(inputCss ? (inputCss as Record<string, Theme>) : {}),
                }}
              ></textarea>
            ) : (
              <input
                ref={inputRef}
                defaultValue={text}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                onKeyDown={handleKeyPress}
                css={{
                  position: 'absolute',
                  border: 'none',
                  left: 0,
                  top: 0,
                  borderBottom: '1px dashed #000',
                  backgroundColor: 'transparent',
                  width: '100%',
                  fontWeight: 'bold',
                  color: 'inherit',
                  font: 'inherit',
                  zIndex: 1,
                  resize: 'none',
                  ...(inputCss ? (inputCss as Record<string, Theme>) : {}),
                }}
              />
            )}
            <span
              css={{ opacity: 0, margin: '0 6px', ...overflowStyle as Record<string, Theme> }}
            >
              {textDraft}
            </span>
          </div>
        ) : (
          <span
            onClick={handleDoubleClick}
            css={{
              color: text ? 'inherit' : styles.placeholderColor,
              fontWeight: 'bold',
              font: 'inherit',
              cursor: 'text',
              ...overflowStyle as Record<string, Theme>
            }}
          >
            {text || placeholder}
          </span>
        )}
      </div>
    </div>
  );
};

export default EditInlineInput;
