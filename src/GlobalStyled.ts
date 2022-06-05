import { createGlobalStyle } from "styled-components"
import MonsterRatRegular from './assets/fonts/Montserrat-Regular.ttf'
import MonsterRatSemiBold from './assets/fonts/Montserrat-SemiBold.ttf'
import MonsterRatBold from './assets/fonts/Montserrat-Bold.ttf'
import Hind from './assets/fonts/Hind-Regular.ttf'

export const theme = {
  colors: {
    main_bg: '#040506',
    bg: '#1A2128',
    active_bg: '#303C4A',
    grey: '#B2BFCD',
    white: '#FFFFFF',
    orange: '#EB8045',
    grow: '#3CDC68',
  }
};

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Montserrat Regular';
    src: local('Montserrat Regular'), url(${MonsterRatRegular}) format('woff2');
    font-style: normal;
  }

  @font-face {
    font-family: 'Montserrat SemiBold';
    src: local('Montserrat SemiBold'), url(${MonsterRatSemiBold}) format('woff2');
    font-style: normal;
  }

  @font-face {
    font-family: 'Montserrat Bold';
    src: local('Montserrat Bold'), url(${MonsterRatBold}) format('woff2');
    font-style: normal;
  }

  @font-face {
    font-family: 'Hind Regular';
    src: local('Hind Regular'), url(${Hind}) format('woff2');
    font-style: normal;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    background: ${theme.colors.main_bg};
  }

  & .App {
    width: 100vw;
    min-height: 100vh;
    overflow: hidden;
    position: relative;
    background: ${theme.colors.main_bg};
    @media (min-width: 1440px) {
      width: 1440px;
      margin: 0 auto;
    }
  }
`