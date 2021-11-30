import { useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import Link from "next/link";
import Image from "next/image";
import { TabMenu } from 'primereact/tabmenu';
import styled from "styled-components"
import { useLogoutFunction, useUser } from '../lib/useUser';
import logo from '../content/images/log-logo.png';

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 99;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  background-color: var(--surface-a);
`;

const LogoWrapper = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  padding: 0.25rem;
  cursor: pointer;

  & > :nth-child(2) {
    margin-left: 0.5rem;
  }
`;

export default function TopBar() {
  const router = useRouter();
  const user = useUser();
  const [logOut] = useLogoutFunction();
  const menuKey = router.asPath.split('/')[1];
  const [activePage, setActivePage] = useState(menuKey);

  const menuItems = [
    {label: 'Home', path:'/', icon: 'pi pi-fw pi-home'},
    {label: 'Teams', path:'/teams', icon: 'pi pi-fw pi-shield'},
    {label: 'Players', path:'/players', icon: 'pi pi-fw pi-user'},
    {label: 'Transactions', path:'/free-agency', icon: 'pi pi-fw pi-sync'},
    {label: 'Rulebook', path:'/rule-book', icon: 'pi pi-fw pi-book'}
  ];

  if (user) {
    menuItems.push({
      label: 'Logout',
      icon: 'pi pi-fw pi-sign-out',
      callback: logOut
    })
  }

  return (
    <HeaderWrapper>
      <Link href="/" passHref={true}>
        <LogoWrapper>
        <Image
          alt='The Leage of Ordinary Gentlemen'
          layout='fixed'
          width='37'
          height='50'
          src={logo}
        />
        <span>The LOG</span>
        </LogoWrapper>
      </Link>
      <TabMenu
        model={menuItems}
        activeIndex={activePage}
        onTabChange={(e) => {
          if (e.value.callback) {
            e.value.callback()
          }

          if (e.value.path) {
            router.push(e.value.path);
          }
        }}
      />
    </HeaderWrapper>
  )
}
