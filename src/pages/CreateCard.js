// src/pages/CreateCard.js
import React from 'react';
import { Container, Box } from '@mui/material';
import CreateCardForm from '../components/CreateCardForm/CreateCardForm';
import BackButton from '../components/BackButton/BackButton';

const CreateCard = () => {
  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        py={4}
      >
        {/* Botón volver */}
        <Box mb={3}>
          <BackButton />
        </Box>

        {/* Formulario */}
        <Box flex={1} display="flex" alignItems="center" justifyContent="center">
          <CreateCardForm />
        </Box>
      </Box>
    </Container>
  );
};

export default CreateCard;