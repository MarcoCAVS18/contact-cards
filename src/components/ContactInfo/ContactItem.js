// src/components/ContactInfo/ContactItem.js
import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const ContactItem = ({ label, value, href, icon: Icon }) => {
  return (
    <Box mb={1.5}>
      <Typography 
        variant="caption" 
        color="text.secondary"
        mb={0.3}
        display="block"
      >
        {label}
      </Typography>
      
      <Link
        href={href}
        color="text.primary"
        underline="none"
        sx={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '0.875rem',
          fontWeight: '400',
          transition: 'color 0.2s ease',
          '&:hover': {
            color: 'primary.main',
          }
        }}
      >
        {Icon && <Icon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />}
        {value}
      </Link>
    </Box>
  );
};

export default ContactItem;