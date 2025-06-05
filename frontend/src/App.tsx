import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box } from '@mui/material';
import SearchComponent from './components/SearchComponent';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0D47A1',
    },
    secondary: {
      main: '#19857b',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          py: 4,
          background: 'linear-gradient(45deg, #0D47A1 30%, #19857b 90%)',
        }}
      >
        <Container maxWidth="md">
          <SearchComponent />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 