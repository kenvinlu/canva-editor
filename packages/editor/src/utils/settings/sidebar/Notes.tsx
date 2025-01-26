import EditInlineInput from 'canva-editor/components/EditInlineInput';
import { useEditor } from 'canva-editor/hooks';
import React, { ChangeEvent } from 'react';
interface Props {
  placeholder?: string;
  charLimit?: number;
}
const Notes: React.FC<Props> = ({
  placeholder = 'Notes will be displayed in Presenter View',
  charLimit = 5000,
}) => {
  const { activePage, pageName, notes, actions } = useEditor((state) => {
    const activePage = state.pages[state.activePage];
    return {
      activePage: state.activePage,
      pageName: activePage.name,
      notes: activePage.notes,
    };
  });

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    const inputText: string = event.target.value;
    if (inputText.length <= charLimit) {
      actions.setPageNotes(activePage, inputText);
    } else {
      const trimmedText: string = inputText.slice(0, charLimit);
      actions.setPageNotes(activePage, trimmedText);
    }
  };

  const charCount: number = notes.length;

  return (
    <div
      css={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        overflowY: 'auto',
        display: 'flex',
      }}
    >
      <div
        css={{
          display: 'flex',
          height: 50,
          borderBottom: '1px solid rgba(57,76,96,.15)',
          padding: '0 20px',
        }}
      >
        <div
          css={{
            fontWeight: 600,
            color: 'rgba(13,18,22,.7)',
            flexGrow: 1,
            display: 'flex',
            marginTop: 16,
          }}
        >
          Page {activePage + 1} -&nbsp;
          <EditInlineInput
            text={pageName}
            placeholder='Add page title'
            onSetText={(newText) => {
              actions.setPageName(activePage, newText);
            }}
          />
        </div>
      </div>
      <div css={{ height: 'calc(100% - 98px)' }}>
        <textarea
          value={notes}
          onChange={handleChange}
          placeholder={placeholder}
          css={{
            width: '100%',
            height: '100%',
            padding: '24px 24px 0',
            fontSize: 18,
          }}
        />
        <p css={{ padding: '12px 24px', textAlign: 'right' }}>
          {charCount} / {charLimit}
        </p>
      </div>
    </div>
  );
};

export default Notes;
