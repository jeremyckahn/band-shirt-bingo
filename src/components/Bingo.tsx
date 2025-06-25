import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material'
import { useBands } from '../contexts/Bands/useBands'

function Bingo() {
  const { bands, isLoading, error, refetch } = useBands()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h2"
        component="h1"
        align="center"
        gutterBottom
        sx={{ mb: 4 }}
      >
        Band Shirt Bingo
      </Typography>

      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            py: 8,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading bands...
          </Typography>
        </Box>
      )}

      {error && (
        <Box sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Retry
              </Button>
            }
          >
            Failed to load bands: {error.message}
          </Alert>
        </Box>
      )}

      {!isLoading && !error && bands.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridTemplateRows: 'repeat(6, 1fr)',
            gap: 1,
            maxWidth: 900,
            aspectRatio: '1/1',
            mx: 'auto',
          }}
        >
          {bands.map((band, index) => (
            <Paper
              key={index}
              elevation={2}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 1,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  elevation: 4,
                  transform: 'scale(1.02)',
                },
              }}
            >
              <Typography
                variant="body2"
                align="center"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                  lineHeight: 1.2,
                }}
              >
                {band}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  )
}

export default Bingo
