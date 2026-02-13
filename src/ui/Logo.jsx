import styled from "styled-components";

const StyledLogo = styled.div`
  text-align: center;
`;

const Img = styled.img`
  /* height: 9.6rem; */
  height: 11.6rem;
  width: auto;
`;

function Logo() {
  return (
    <StyledLogo>
      <Img src="/logo-light.webp" alt="Logo" />
    </StyledLogo>
  );
}

export default Logo;
