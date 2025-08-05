// src/components/PersonalInfo/PersonalInfo.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const PersonalInfo = ({ fullName, title }) => {
  return (
    <Box mb={2}>
      <Typography 
        variant="h3" 
        component="h1"
        color="text.primary"
        mb={0.5}
        sx={{ 
          fontSize: { xs: '1.5rem', md: '1.75rem' },
          fontWeight: 600,
          lineHeight: 1.2
        }}
      >
        {fullName}
      </Typography>
      
      <Typography 
        variant="h6" 
        color="text.secondary"
        sx={{ 
          fontSize: { xs: '0.9rem', md: '1rem' },
          fontWeight: 400,
          lineHeight: 1.4
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default PersonalInfo;