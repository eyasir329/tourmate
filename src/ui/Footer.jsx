import styled from "styled-components";

const StyledFooter = styled.footer`
  background-color: var(--color-grey-0);
  padding: 0.8rem 0 0.8rem;
  text-align: center;
  border-top: 1px solid var(--color-grey-100);
`;

function Footer() {
  return <StyledFooter>Footer</StyledFooter>;
}

export default Footer;
