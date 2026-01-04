import BaseSkeleton from '../base/skeleton/BaseSkeleton';
const Sidebar = () => (
  <div
    style={{
      width: '60px',
      backgroundColor: '#e5e7eb',
      height: '100%',
      position: 'fixed',
      top: 65,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1rem 0',
      gap: '0.5rem',
    }}
  >
    {[...Array(6)].map((_, i) => (
      <BaseSkeleton key={i} style={{ width: '24px', height: '24px' }} />
    ))}
    <BaseSkeleton
      style={{ width: '24px', height: '24px', marginTop: 'auto' }}
    />{' '}
    {/* Version indicator */}
  </div>
);

const Header = () => (
  <div
    style={{
      backgroundColor: '#e5e7eb',
      color: '#fff',
      padding: '0.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 65
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <BaseSkeleton style={{ width: '80px', height: '24px' }} />{' '}
      {/* CanvasClone */}
      <BaseSkeleton style={{ width: '40px', height: '24px' }} /> {/* File */}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <BaseSkeleton style={{ width: '100px', height: '24px' }} />{' '}
      {/* Untitled design */}
      <BaseSkeleton style={{ width: '24px', height: '24px' }} /> {/* Cloud */}
      <BaseSkeleton style={{ width: '24px', height: '24px' }} /> {/* Undo */}
      <BaseSkeleton style={{ width: '24px', height: '24px' }} /> {/* Export */}
    </div>
  </div>
);

const MainArea = () => (
  <div
    style={{ marginLeft: '60px', padding: '1rem', backgroundColor: '#f3f4f6', height: 'calc(100vh - 65px)' }}
  >
    <div style={{ width: 800, margin: 'auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <BaseSkeleton style={{ width: '80px', height: '24px' }} />{' '}
        {/* Position label */}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <BaseSkeleton style={{ width: '120px', height: '24px' }} />{' '}
        {/* Page 1 - Add page title */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <BaseSkeleton style={{ width: '24px', height: '24px' }} />{' '}
          {/* Down arrow */}
          <BaseSkeleton style={{ width: '24px', height: '24px' }} />{' '}
          {/* Up arrow */}
          <BaseSkeleton style={{ width: '24px', height: '24px' }} />{' '}
          {/* Lock */}
          <BaseSkeleton style={{ width: '24px', height: '24px' }} />{' '}
          {/* Copy */}
          <BaseSkeleton style={{ width: '24px', height: '24px' }} />{' '}
          {/* Trash */}
          <BaseSkeleton style={{ width: '24px', height: '24px' }} />{' '}
          {/* Plus */}
        </div>
      </div>
      <div
        style={{
          border: '1px solid rgb(181, 181, 181)',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
        }}
      >
        {/* Empty canvas area */}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1rem',
        }}
      >
        <BaseSkeleton style={{ width: '100%', height: '42px' }} />{' '}
      </div>
    </div>
  </div>
);
function EditorSkeleton() {
  return (
    <div>
      <Header />
      <Sidebar />
      <MainArea />
    </div>
  );
}
export default EditorSkeleton;
