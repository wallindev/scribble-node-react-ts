import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: dark;
  }

  body {
    background-color: #242424;
    color: rgba(255, 255, 255, 0.87);
    font-family: Roboto, sans-serif;
    margin: 0;
    padding: 2rem;
    text-align: center;
    height: 100vh;
  }

  div#root {
    margin: 0 auto;
  }

  a, a:visited {
    color: #646cff;
    text-decoration: none;
  }
  a:hover {
    color: #535bf2;
  }
`;

export default GlobalStyle
