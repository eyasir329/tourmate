import styled from "styled-components";
// import Logo from "./Logo";
// import Title from "./Title";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
`;

// const HeaderFraction = styled.div`
//   display: grid;
//   grid-template-columns: 36rem 1fr;
// `;

function Header() {
  return (
    <StyledHeader>
      {/* <HeaderFraction>
        <Logo />
        <Title />
      </HeaderFraction> */}
      Header
    </StyledHeader>
  );
}

export default Header;
