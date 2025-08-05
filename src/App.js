// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { theme } from './theme/theme';
import Home from './pages/Home';
import CreateCard from './pages/CreateCard';
import ViewCard from './pages/ViewCard';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 35%, #1d4ed8 100%)',
            position: 'relative',
            overflow: 'hidden',
            // Formas flotantes de fondo
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '10%',
              right: '15%',
              width: '120px',
              height: '120px',
              background: '#fbbf24',
              borderRadius: '50%',
              opacity: 0.8,
              transform: 'translate(20px, -10px)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '20%',
              left: '10%',
              width: '80px',
              height: '80px',
              background: '#ef4444',
              borderRadius: '50%',
              opacity: 0.7,
              transform: 'translate(-15px, 25px)',
            }
          }}
        >
          {/* Círculos flotantes adicionales */}
          <Box
            sx={{
              position: 'absolute',
              top: '30%',
              right: '8%',
              width: '60px',
              height: '60px',
              background: '#f59e0b',
              borderRadius: '50%',
              opacity: 0.6,
              transform: 'translate(40px, 15px)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '35%',
              right: '25%',
              width: '90px',
              height: '90px',
              background: '#1e293b',
              borderRadius: '50%',
              opacity: 0.8,
              transform: 'translate(10px, -20px)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '15%',
              left: '20%',
              width: '40px',
              height: '40px',
              background: '#f3f4f6',
              borderRadius: '50%',
              opacity: 0.9,
              transform: 'translate(-25px, 30px)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '10%',
              right: '40%',
              width: '110px',
              height: '110px',
              background: 'rgba(248, 250, 252, 0.9)',
              borderRadius: '50%',
              transform: 'translate(30px, -15px)',
            }}
          />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateCard />} />
            <Route path="/card/:slug" element={<ViewCard />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;