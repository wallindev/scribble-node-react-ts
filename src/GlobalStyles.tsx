import { createGlobalStyle } from 'styled-components';
import 'normalize.css';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

  :root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --font-size-base: 16px;

    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: dark light;
    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: Roboto, sans-serif;
    margin: 0;
    padding: 2rem;
    /* color: #333; */
    display: flex;
    /* place-items: center; */
    text-align: center;
    min-width: 320px;
    max-width: 1280px;
    min-height: 100vh;
  }

  div#root {
    margin: 0 auto;
  }

  h1 {
    /* font-size: 3.2em; */
    line-height: 1.1;
  }

  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    cursor: pointer;
    transition: border-color 0.25s;
  }
  button:hover {
    border-color: #646cff;
  }
  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }

  a, a:visited {
    font-weight: 500;
    color: #646cff;
    text-decoration: none;
  }
  a:hover {
    color: #535bf2;
  }

  @media (prefers-color-scheme: light) {
    :root {
      color: #213547;
      background-color: #ffffff;
    }
    a:hover {
      color: #747bff;
    }
    button {
      background-color: #f9f9f9;
    }
  }
`;

export default GlobalStyle