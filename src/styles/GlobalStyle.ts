import { createGlobalStyle } from 'styled-components'
import { retroTheme } from './theme'

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: ${retroTheme.colors.spaceBlack};
    color: ${retroTheme.colors.neonGreen};
    font-family: ${retroTheme.fonts.body};
  }
`

export default GlobalStyle 