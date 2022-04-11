import Typography from './global/typography.js'
import { createGlobalStyle } from 'styled-components';

import 'normalize.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/md-light-indigo/theme.css';
import 'primeflex/primeflex.min.css';


const Globals = createGlobalStyle`
  html, body, #__next {
    display: block;
    height: 100%;
    width: 100%;
    background-color: var(--bluegray-100);
  }

  * {
    grid-column: span 12;
  }

  .p-card-body, .p-card-wrapper, .p-card-content {
    height: 100%
  }
`

export default function GlobalStyles() {
  return (
    <>
      <Typography/>
      <Globals/>
    </>
  )
}
