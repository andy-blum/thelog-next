import { createGlobalStyle } from "styled-components";

const TypographyStyles = createGlobalStyle`
  :root {
    font-family: var(--font-family);
    color: var(--text-color);
    font-size: 14px;
    line-height: 1.4;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;

    li {
      padding: 0;
    }
  }
`;

export default TypographyStyles;
