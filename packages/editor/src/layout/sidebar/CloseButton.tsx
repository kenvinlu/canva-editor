import { FC } from 'react';

const CloseSidebarButton: FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div
      css={{
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translate(100%,-50%)',
        zIndex: 40
      }}
    >
      <button css={{ position: 'relative', display: 'grid' }} onClick={onClose}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 13 96'
          width='13'
          height='96'
          fill='none'
        >
          <path
            fill='#fff'
            d='M0,0 h1 c0,20,12,12,12,32 v32 c0,20,-12,12,-12,32 H0 z'
          ></path>
          <path stroke="#e8e9ef" d='M0.5,0 c0,20,12,12,12,32 v32 c0,20,-12,12,-12,32'></path>
        </svg>
        <span css={{ position: 'absolute', alignSelf: 'center' }}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='12'
            height='12'
            viewBox='0 0 12 12'
          >
            <path
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeWidth='1.25'
              d='M7 3.17 4.88 5.3a1 1 0 0 0 0 1.42L7 8.83'
            ></path>
          </svg>
        </span>
      </button>
    </div>
  );
};

export default CloseSidebarButton;
