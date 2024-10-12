import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import styled from "styled-components";
import Footer from "./Footer";

const StyledAppLayout = styled.div`
  display: grid;
  /* grid-template-rows: auto 1fr auto; */
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
`;

// const StyledApp = styled.div`
//   display: grid;
//   grid-template-columns: 26rem 1fr;
// `;

const Main = styled.main`
  background-color: var(--color-grey-50);
  padding: 4rem 4.8rem 6.4rem;
`;

function AppLayout() {
  return (
    <StyledAppLayout>
      <Header />
      {/* <StyledApp> */}
      <Sidebar />
      <Main>
        {/* no div inside outlet.. only fragment.. to impliment style in whole app (that are use in main) */}
        <Outlet />
      </Main>
      {/* </StyledApp> */}
      <Footer />
    </StyledAppLayout>
  );
}

export default AppLayout;
