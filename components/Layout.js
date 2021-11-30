import styled from "styled-components";
import GlobalStyles from "../styles/globalStyles";
import LoginForm from "./LoginForm";
import { useLogoutFunction, useUser } from "../lib/useUser";
import TopBar from "./TopBar";
import { useEffect } from "react";

const SiteWrapper = styled.div`
`;

const ContentWrapper = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(12, 1fr);
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem 3rem 3rem;
`;


export default function Layout({children}) {

  const user = useUser();
  const [logout] = useLogoutFunction();

  return (
    <SiteWrapper>
      <GlobalStyles/>
      <TopBar/>
      <ContentWrapper>
        {user ? children : <LoginForm />}
      </ContentWrapper>
    </SiteWrapper>
  )
}
