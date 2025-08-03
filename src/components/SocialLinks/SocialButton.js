// src/components/SocialLinks/SocialButton.js
import React from 'react';
import { IconButton } from '@mui/material';

const SocialButton = ({ name, icon: Icon, onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      size="small"
      sx={{
        width: 36,
        height: 36,
        color: 'text.secondary',
        backgroundColor: 'grey.100',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'grey.200',
          color: 'text.primary',
        }
      }}
    >
      <Icon sx={{ fontSize: '1.2rem' }} />
    </IconButton>
  );
};

export default SocialButton;