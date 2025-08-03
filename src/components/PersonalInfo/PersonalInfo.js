// src/components/PersonalInfo/PersonalInfo.js
import React from 'react';
import { Typography, Box } from '@mui/material';

const PersonalInfo = () => {
  return (
    <Box 
      textAlign={{ xs: 'center', md: 'left' }}
      mb={{ xs: 2, md: 0 }}
    >
      <Typography 
        variant="h3" 
        component="h1" 
        color="text.primary"
        mb={0.5}
        sx={{
          fontSize: { xs: '1.5rem', md: '1.75rem' }
        }}
      >
        Tec. Pablo Bruna
      </Typography>
      
      <Typography 
        variant="body1" 
        color="text.secondary"
        mb={1.5}
        fontWeight="400"
      >
        Técnico Especializado
      </Typography>
    </Box>
  );
};

export default PersonalInfo;