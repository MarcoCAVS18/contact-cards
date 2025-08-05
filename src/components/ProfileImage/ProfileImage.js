// src/components/ProfileImage/ProfileImage.js
import React from 'react';
import { Avatar, Box } from '@mui/material';

const ProfileImage = ({ initials = 'PB' }) => {
  return (
    <Box 
      display="flex" 
      justifyContent={{ xs: 'center', md: 'flex-start' }}
      mb={{ xs: 2, md: 0 }}
      position="relative"
    >
      {/* Círculo decorativo detrás del avatar */}
      <Box
        sx={{
          position: 'absolute',
          top: '-8px',
          left: { xs: 'calc(50% - 55px)', md: '-8px' },
          width: '110px',
          height: '110px',
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          borderRadius: '50%',
          opacity: 0.2,
          zIndex: 0,
        }}
      />
      
      <Avatar
        sx={{
          width: { xs: 90, md: 100 },
          height: { xs: 90, md: 100 },
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          fontSize: { xs: '1.75rem', md: '2rem' },
          fontWeight: 600,
          color: 'white',
          border: '4px solid rgba(255,255,255,0.9)',
          boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)',
          position: 'relative',
          zIndex: 1,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 12px 30px rgba(37, 99, 235, 0.4)',
          }
        }}
      >
        {initials}
      </Avatar>
    </Box>
  );
};

export default ProfileImage;