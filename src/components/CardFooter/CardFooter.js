// src/components/CardFooter/CardFooter.js
import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const CardFooter = () => {
  return (
    <Box mt={3}>
      <Divider sx={{ mb: 2, borderColor: 'grey.200' }} />
      
      <Typography 
        variant="caption" 
        color="text.secondary"
        display="block"
        textAlign={{ xs: 'center', md: 'left' }}
      >
        Escanea el QR para guardar este contacto
      </Typography>
    </Box>
  );
};

export default CardFooter;