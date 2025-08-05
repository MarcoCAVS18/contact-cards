// src/pages/ViewCard.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Alert, CircularProgress, Typography } from '@mui/material';
import ContactCard from '../components/ContactCard/ContactCard';
import BackButton from '../components/BackButton/BackButton';
import { getContactCard } from '../firebase/firestore';

const ViewCard = () => {
  const { slug } = useParams();
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCard = async () => {
      try {
        setLoading(true);
        const card = await getContactCard(slug);
        
        if (card) {
          setCardData(card);
        } else {
          setError('Tarjeta no encontrada');
        }
      } catch (err) {
        setError('Error al cargar la tarjeta');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCard();
    }
  }, [slug]);

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
        >
          <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
          <Typography variant="h6" color="white">
            Cargando tarjeta...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          gap={3}
        >
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {error}
          </Alert>
          <BackButton text="Volver al Inicio" />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        py={4}
      >
        {/* Botón volver */}
        <Box mb={3}>
          <BackButton text="Volver al Inicio" />
        </Box>

        {/* Tarjeta de contacto */}
        <Box flex={1} display="flex" alignItems="center" justifyContent="center">
          {cardData && <ContactCard cardData={cardData} />}
        </Box>
      </Box>
    </Container>
  );
};

export default ViewCard;