import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { GlobalStyle, theme } from './GlobalStyled';
import { ThemeProvider } from 'styled-components';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App/>
      <GlobalStyle/>
    </ThemeProvider>
  </React.StrictMode>
)
