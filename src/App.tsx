import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { darkTheme } from './theme'
import Bingo from './components/Bingo'
import { BandsProvider } from './contexts/Bands/BandsContext'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BandsProvider>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Bingo />
        </ThemeProvider>
      </BandsProvider>
    </QueryClientProvider>
  )
}

export default App
