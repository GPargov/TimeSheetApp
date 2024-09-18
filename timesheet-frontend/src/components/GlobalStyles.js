import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Arial', sans-serif;
  }

  body {
    background-color: #f5f5f5;
  }

  h2 {
    color: #333;
  }

  input, button {
    font-family: 'Arial', sans-serif;
  }
`;

export default GlobalStyle;
