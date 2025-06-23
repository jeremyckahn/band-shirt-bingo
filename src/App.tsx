import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Typography, Box, Paper } from "@mui/material";

const bands: string[] = [
  "Led Zeppelin",
  "Queen",
  "The Beatles",
  "The Rolling Stones",
  "AC/DC",
  "Pink Floyd",
  "Metallica",
  "Nirvana",
  "Guns N' Roses",
  "U2",
  "Red Hot Chili Peppers",
  "Foo Fighters",
  "Green Day",
  "Pearl Jam",
  "Aerosmith",
  "Iron Maiden",
  "Black Sabbath",
  "Deep Purple",
  "Van Halen",
  "Rush",
  "Def Leppard",
  "Bon Jovi",
  "Journey",
  "Eagles",
  "The Who",
  "Jimi Hendrix Experience",
  "Cream",
  "The Doors",
  "Dire Straits",
  "Fleetwood Mac",
  "Lynyrd Skynyrd",
  "The Clash",
  "Ramones",
  "ZZ Top",
  "KISS",
  "Soundgarden",
];

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#bb86fc",
    },
    secondary: {
      main: "#03dac6",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
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

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gridTemplateRows: "repeat(6, 1fr)",
            gap: 1,
            maxWidth: 900,
            aspectRatio: "1/1",
            mx: "auto",
          }}
        >
          {bands.map((band, index) => (
            <Paper
              key={index}
              elevation={2}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 1,
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  elevation: 4,
                  transform: "scale(1.02)",
                },
              }}
            >
              <Typography
                variant="body2"
                align="center"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                  lineHeight: 1.2,
                }}
              >
                {band}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
