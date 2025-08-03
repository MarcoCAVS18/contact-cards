// src/components/SocialLinks/SocialButton.js
import React from 'react';
import { IconButton } from '@mui/material';

const SocialButton = ({ name, icon: Icon, onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      size="small"
      sx={{
        width: 42,
        height: 42,
        color: '#6b7280',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(243,244,246,0.8) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.3)',
        transition: 'all 0.3s ease',
        '&:hover': {
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          color: 'white',
          transform: 'translateY(-2px) scale(1.05)',
          boxShadow: '0 8px 20px rgba(251, 191, 36, 0.3)',
        }
      }}
    >
      <Icon sx={{ fontSize: '1.3rem' }} />
    </IconButton>
  );
};

export default SocialButton;