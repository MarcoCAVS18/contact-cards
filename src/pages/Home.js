// src/pages/Home.js
import React, { useState } from 'react';
import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { searchCardByName } from '../firebase/firestore';

const Home = () => {
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateCard = () => {
    navigate('/create');
  };

  const handleManageCard = () => {
    navigate('/manage');
  };

  const handleSearchCard = async () => {
    if (!searchName.trim()) {
      setError('Por favor ingresa un nombre');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const card = await searchCardByName(searchName.trim());
      if (card) {
        navigate(`/card/${card.id}`);
      } else {
        setError('No se encontró ninguna tarjeta con ese nombre');
      }
    } catch (err) {
      setError('Error al buscar la tarjeta. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchCard();
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        py={4}
      >
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Typography 
            variant="h2" 
            component="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3rem' },
              fontWeight: 700,
              color: 'white',
              mb: 2,
              textShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            Tarjetas Digitales
          </Typography>
          <Typography 
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.1rem' }
            }}
          >
            Crea y comparte tu información de contacto de manera profesional
          </Typography>
        </Box>

        {/* Main Card */}
        <Card 
          elevation={0}
          sx={{
            borderRadius: 3,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25), 0 12px 25px rgba(0,0,0,0.15)',
            width: '100%',
            maxWidth: '400px'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Botón Crear Tarjeta */}
            <Button
              onClick={handleCreateCard}
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              fullWidth
              sx={{
                mb: 2,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(37, 99, 235, 0.4)',
                }
              }}
            >
              Crear Mi Tarjeta
            </Button>

            {/* Botón Gestionar Tarjeta */}
            <Button
              onClick={handleManageCard}
              variant="outlined"
              size="large"
              startIcon={<ManageAccountsIcon />}
              fullWidth
              sx={{
                mb: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 500,
                borderColor: '#f59e0b',
                color: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                '&:hover': {
                  borderColor: '#d97706',
                  backgroundColor: 'rgba(245, 158, 11, 0.2)',
                  color: '#d97706',
                  transform: 'translateY(-1px)',
                }
              }}
            >
              Gestionar Mi Tarjeta
            </Button>

            {/* Divider */}
            <Box 
              display="flex" 
              alignItems="center" 
              my={3}
            >
              <Box 
                sx={{ 
                  flex: 1, 
                  height: '1px', 
                  background: 'linear-gradient(to right, transparent, #e5e7eb, transparent)' 
                }} 
              />
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mx: 2, fontSize: '0.8rem' }}
              >
                O
              </Typography>
              <Box 
                sx={{ 
                  flex: 1, 
                  height: '1px', 
                  background: 'linear-gradient(to right, transparent, #e5e7eb, transparent)' 
                }} 
              />
            </Box>

            {/* Sección Buscar Tarjeta */}
            <Box>
              <Typography 
                variant="body1" 
                color="text.primary"
                mb={2}
                textAlign="center"
                sx={{ fontWeight: 500 }}
              >
                ¿Ya tienes tu tarjeta?
              </Typography>

              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ingresa tu nombre completo"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                  }
                }}
              />

              <Button
                onClick={handleSearchCard}
                variant="outlined"
                size="large"
                startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 500,
                  borderColor: '#e5e7eb',
                  color: 'text.primary',
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  '&:hover': {
                    borderColor: '#d1d5db',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                {loading ? 'Buscando...' : 'Buscar Tarjeta'}
              </Button>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 2,
                    borderRadius: 2,
                    fontSize: '0.8rem'
                  }}
                >
                  {error}
                </Alert>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Home;