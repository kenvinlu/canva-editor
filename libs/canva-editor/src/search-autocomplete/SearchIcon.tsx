import styled from 'styled-components';

export const SearchIcon = ({ icon, showIcon }: { icon?: any; showIcon: boolean; }) => {
  if (!showIcon) {
    return null;
  }

  if (icon) {
    return <Container>{icon}</Container>;
  }

  return (
    <Container>
      <StyledSearchIcon
        className='search-icon'
        width={24}
        height={24}
        focusable='false'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
      >
        <path d="M17.928 1.048c.013-.064.13-.064.144 0 .115.543.38 1.51.875 2.005.495.496 1.462.76 2.006.875.063.013.063.13 0 .144-.544.115-1.51.38-2.006.875-.496.495-.76 1.462-.875 2.005-.013.064-.13.064-.144 0-.115-.543-.38-1.51-.875-2.005-.495-.496-1.462-.76-2.006-.875-.063-.013-.063-.13 0-.144.544-.115 1.51-.38 2.006-.875.496-.495.76-1.462.875-2.005ZM13.067 4.046c-.012-.061-.122-.061-.134 0-.133.67-.477 2.044-1.16 2.727-.683.683-2.057 1.027-2.727 1.16-.061.012-.061.122 0 .134.67.133 2.044.477 2.727 1.16.683.683 1.027 2.057 1.16 2.727.012.061.122.061.134 0 .133-.67.477-2.044 1.16-2.727.683-.683 2.057-1.027 2.727-1.16.061-.012.061-.122 0-.134-.67-.133-2.044-.477-2.727-1.16-.683-.683-1.027-2.057-1.16-2.727Z" fill="currentColor"></path><path d="M2 11.5a7.5 7.5 0 0 0 12.202 5.843l4.156 4.157a1 1 0 1 0 1.415-1.414l-4.193-4.193A7.46 7.46 0 0 0 16.984 12h-1.505A6 6 0 1 1 9 5.52V4.017A7.5 7.5 0 0 0 2 11.5Z" fill="currentColor"></path>
      </StyledSearchIcon>
    </Container>
  );
};

const Container =styled.div`
  margin: ${(props: any) => props.theme.searchIconMargin};
`;
const StyledSearchIcon = styled.svg`
  flex-shrink: 0;
  fill: ${(props: any) => props.theme.iconColor};
`;
