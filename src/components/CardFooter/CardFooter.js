// src/components/CardFooter/CardFooter.js
import React from 'react';
import { Box, Typography, Divider, IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const CardFooter = ({ onToggleQR, showQR }) => {
  return (
    <Box mt={3}>
      <Divider sx={{ mb: 2, borderColor: 'grey.200' }} />
      
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent={{ xs: 'center', md: 'flex-start' }}
        sx={{ cursor: 'pointer' }}
        onClick={onToggleQR}
      >
        <IconButton
          size="small"
          sx={{
            mr: 1,
            transition: 'transform 0.3s ease',
            transform: showQR ? 'rotate(180deg)' : 'rotate(0deg)',
            color: 'text.secondary',
          }}
        >
          <KeyboardArrowDownIcon sx={{ fontSize: '1.2rem' }} />
        </IconButton>
        
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{
            transition: 'color 0.2s ease',
            '&:hover': {
              color: 'primary.main',
            }
          }}
        >
          Presiona y Escanea el QR para guardar este contacto
        </Typography>
      </Box>
    </Box>
  );
};

export default CardFooter;