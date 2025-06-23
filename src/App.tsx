import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { darkTheme } from './theme'
import Bingo from './components/Bingo'

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Bingo />
    </ThemeProvider>
  )
}

export default App
