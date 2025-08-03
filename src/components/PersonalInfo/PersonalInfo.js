// src/components/PersonalInfo/PersonalInfo.js
import React from 'react';
import { Typography, Box } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

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
      
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent={{ xs: 'center', md: 'flex-start' }}
        color="text.secondary"
      >
        <LocationOnOutlinedIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
        <Typography variant="body2" fontWeight="400">
          Argentina
        </Typography>
      </Box>
    </Box>
  );
};

export default PersonalInfo;