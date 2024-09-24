import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Roboto', sans-serif;
    background-color: #f8f9fa;
    color: #333;
    line-height: 1.6;
  }

  h2 {
    font-size: 24px;
    color: #0056b3;
    margin-bottom: 20px;
  }

  button {
    font-family: 'Roboto', sans-serif;
  }
`;

export default GlobalStyle;
