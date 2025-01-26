import styled from '@emotion/styled';

export const PageGridItem = styled.button<{isNew: boolean;}>`
  position: relative;
  transition: border-color 0.3s;
  width: 100%;
  border-radius: 8px;
  animation: ${({ isNew }) => (isNew ? 'fadeIn 0.6s, floating 0.8s' : 'none')};

  @keyframes floating {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  > div:nth-of-type(1) {
    overflow: hidden;
    background-color: #fff;
    border: 3px solid transparent;
    pointer-events: none;
    border-radius: 8px;
    box-shadow: 0 0 0 1px rgba(64,87,109,.07),0 2px 8px rgba(57,76,96,.15);
  }

  > div:nth-of-type(2) {
    padding: 8px 8px 12px;
    font-weight: 600;
    color: #000;
    display: inline-flex;
  }
`;

export const PageGridItemContainer = styled.div`
  position: relative;
  background-color: transparent;
  border-radius: 8px;

  .add-btn {
    display: none;
    position: absolute;
    top: calc(50% - 36px);
    right: 8px;
  }
  
  &:hover .add-btn {
    display: flex;
  }

  &.is-active {
    background-color: #8b3dff4f;
    .page-btn {
      > div:nth-of-type(1) {
        box-shadow: none;
        border-color: #8b3dff;
      }
    }
  }
`;

